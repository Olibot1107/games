const CHANGE_ASPECT_RATIO = true;

var bodyElement = document.getElementsByTagName("body")[0];
var statusElement = document.getElementById("status");
var progressElement = document.getElementById("progress");
var spinnerElement = document.getElementById("spinner");
var canvasElement = document.getElementById("canvas");
var outputElement = document.getElementById("output");
var outputContainerElement = document.getElementById("output-container");
var qrElement = document.getElementById("QRCode");
var qr2Element = document.getElementById("QR2Code");
var qrButton = document.getElementById("QRButton");
var qr2Button = document.getElementById("QR2Button");
var pauseMenu = document.getElementById("pauseMenuContainer");
var resumeButton = document.getElementById("resumeButton");
var quitButton = document.getElementById("quitButton");

const messageContainerElement = document.getElementById("message-container");
const messagesElement = document.getElementById("messages");
let rollbackMessages = [];

let clearRollbackMessagesTimeoutId = -1;
const showRollbackMessage = function (message) {
  let messages = "";
  rollbackMessages.push(message);
  rollbackMessages.forEach((m) => (messages += "<p>" + m + "</p>"));

  messagesElement.innerHTML = messages;
  messageContainerElement.style.display = "block";

  if (clearRollbackMessagesTimeoutId === -1) {
    clearTimeout(clearRollbackMessagesTimeoutId);
  }
  clearRollbackMessagesTimeoutId = setTimeout(clearRollbackMessages, 5000);
};

const clearRollbackMessages = function () {
  clearRollbackMessagesTimeoutId = -1;
  rollbackMessages = [];
  messageContainerElement.style.display = "none";
};

var startingHeight, startingWidth;
var startingAspect;
var Module = {
  preRun: [],
  postRun: [],
  print: (function () {
    var element = document.getElementById("output");
    if (element) element.value = ""; // clear browser cache
    return function (text) {
      if (arguments.length > 1)
        text = Array.prototype.slice.call(arguments).join(" ");
      // These replacements are necessary if you render to raw HTML
      //text = text.replace(/&/g, "&amp;");
      //text = text.replace(/</g, "&lt;");
      //text = text.replace(/>/g, "&gt;");
      //text = text.replace('\n', '<br>', 'g');
      console.log(text);
      if (text === "Entering main loop.") {
        // It seems that this text ensures game is loaded.
        ensureAspectRatio();
      }
      if (element) {
        element.value += text + "\n";
        element.scrollTop = element.scrollHeight; // focus on bottom
      }
    };
  })(),
  printErr: function (text) {
    if (arguments.length > 1)
      text = Array.prototype.slice.call(arguments).join(" ");
    console.error(text);
  },
  canvas: (function () {
    var canvas = document.getElementById("canvas");

    return canvas;
  })(),
  setStatus: function (text) {
    if (!Module.setStatus.last)
      Module.setStatus.last = { time: Date.now(), text: "" };
    if (text === Module.setStatus.last.text) return;
    var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
    var now = Date.now();
    if (m && now - Module.setStatus.last.time < 30) return; // if this is a progress update, skip it if too soon
    Module.setStatus.last.time = now;
    Module.setStatus.last.text = text;
    if (m) {
      text = m[1];
      progressElement.value = parseInt(m[2]) * 100;
      progressElement.max = parseInt(m[4]) * 100;
      progressElement.hidden = false;
      spinnerElement.hidden = false;
    } else {
      progressElement.value = null;
      progressElement.max = null;
      progressElement.hidden = true;

      // If there are no status text, we are finished and can display
      // the canvas and hide the spinner
      if (!text) {
        spinnerElement.style.display = "none";
        canvasElement.style.display = "block";
      }
    }
    statusElement.innerHTML = text;
  },
  totalDependencies: 0,
  monitorRunDependencies: function (left) {
    this.totalDependencies = Math.max(this.totalDependencies, left);
    Module.setStatus(
      left
        ? "Preparing... (" +
            (this.totalDependencies - left) +
            "/" +
            this.totalDependencies +
            ")"
        : "All downloads complete."
    );
  },
};
Module.setStatus("Downloading...");
window.onerror = function (event) {
  // TODO: do not warn on ok events like simulating an infinite loop or exitStatus
  Module.setStatus("Exception thrown, see JavaScript console");
  spinnerElement.style.display = "none";
  Module.setStatus = function (text) {
    if (text) Module.printErr("[post-exception status] " + text);
  };
};

// Route URL GET parameters to argc+argv
if (typeof window === "object") {
  Module["arguments"] = window.location.search.substr(1).trim().split("&");
  // If no args were passed arguments = [''], in which case kill the single empty string.
  if (!Module["arguments"][0]) {
    Module["arguments"] = [];
  }
}

function toggleConsole() {
  var isShown = outputElement.style.display === "flex";
  if (isShown) {
    outputElement.style.display = "none";
    outputElement.scrollIntoView(false);
  } else {
    outputElement.style.display = "flex";
    outputElement.scrollIntoView(true);
  }
}

function toggleQRCode() {
  var isShown = !qrElement.hidden;
  if (isShown) {
    qrElement.hidden = true;
    qrButton.innerHTML = "Show QRCode";
  } else {
    qrElement.hidden = false;
    qrButton.innerHTML = "Hide QRCode";
  }
}

function toggleQRCode2() {
  var isShown = !qr2Element.hidden;
  if (isShown) {
    qr2Element.hidden = true;
    qr2Button.innerHTML = "Show Opera GX QRCode";
  } else {
    qr2Element.hidden = false;
    qr2Button.innerHTML = "Hide Opera GX QRCode";
  }
}

/*
      var g_extLostContext = null;

      function toggleWebGLContext() {
        if (g_extLostContext == null) {
          var canvas = document.getElementById('canvas');
          var gl = canvas.getContext('webgl2');
          g_extLostContext = gl.getExtension('WEBGL_lose_context');
        } // end if
        var button = document.getElementById("webglbutton");
        var text = button.textContent || button.innerText;
        if (text.trim() == "Lose WebGL Context") {
          g_extLostContext.loseContext();
          button.textContent = "Restore WebGL Context";
        } // end if
        else {
          g_extLostContext.restoreContext();
          button.textContent = "Lose WebGL Context";
          g_extLostContext = null;
        } // end else
      }
      */
function toggleStats() {
  var elem = document.getElementById("multiplayer-stats");
  if (elem) {
    elem.style.visibility =
      elem.style.visibility == "visible" ? "hidden" : "visible";
  }
}

var g_pWadLoadCallback = undefined;
function setWadLoadCallback(_wadLoadCallback) {
  g_pWadLoadCallback = _wadLoadCallback;
}

var g_pAddAsyncMethod = -1;

function setAddAsyncMethod(asyncMethod) {
  g_pAddAsyncMethod = asyncMethod;
}

var g_pJSExceptionHandler = undefined;

function setJSExceptionHandler(exceptionHandler) {
  if (typeof exceptionHandler == "function") {
    g_pJSExceptionHandler = exceptionHandler;
  } // end if
} // end setJSExceptionHandler

function hasJSExceptionHandler() {
  return (
    g_pJSExceptionHandler != undefined &&
    typeof g_pJSExceptionHandler == "function"
  );
} // end hasJSExceptionHandler

function doJSExceptionHandler(exceptionJSON) {
  if (typeof g_pJSExceptionHandler == "function") {
    var exception = JSON.parse(exceptionJSON);
    g_pJSExceptionHandler(exception);
  } // end if
} // end doJSExceptionHandler

function manifestFiles() {
  return [
    "runner.data",
    "runner.js",
    "runner.wasm",
    "audio-worklet.js",
    "game.unx",
  ].join(";");
}

function manifestFilesMD5() {
  return [
    "7b271187f29ca2d0f59db9d91d8f5fbb",
    "536954f7cf0f327a3f882f6d16864100",
    "6f323d3c886b09bf86db95ecfef4b507",
    "e8f1e8db8cf996f8715a6f2164c2e44e",
    "b57c323d822255afa80d7ec6c64e096d",
  ];
}

function onFirstFrameRendered() {
  //console.log("First frame rendered!");
}

function onGameSetWindowSize(width, height) {
  if (startingHeight === undefined && startingWidth === undefined) {
    console.log(
      "Initial window size set to width: " + width + ", height: " + height
    );

    startingHeight = height;
    startingWidth = width;
    startingAspect = startingWidth / startingHeight;
  }
}

function triggerAd(
  adId,
  _callback_beforeAd,
  _callback_afterAd,
  _callback_adDismissed,
  _callback_adViewed,
  _callback_adbreakDone
) {
  // need to take a copy of the RValues represented
  var pRValueCopy = triggerAdPrefix(
    _callback_beforeAd,
    _callback_afterAd,
    _callback_adDismissed,
    _callback_adViewed,
    _callback_adbreakDone
  );
  var pCallbackBeforeAd = pRValueCopy + 0 * 16;
  var pCallbackAfterAd = pRValueCopy + 1 * 16;
  var pCallbackAdDismissed = pRValueCopy + 2 * 16;
  var pCallbackAdViewed = pRValueCopy + 3 * 16;
  var pCallbackAdBreakDone = pRValueCopy + 4 * 16;

  adBreak({
    type: "reward", // The type of this placement
    name: adId, // A descriptive name for this placement

    beforeAd: () => {
      // Prepare for the ad. Mute and pause the game flow
      console.log("beforeAd");
      // trigger _callback_beforeAd to game
      doGMLCallback(pCallbackBeforeAd, { id: adId });
    },
    afterAd: () => {
      // Resume the game and re-enable sound
      console.log("afterAd");
      // trigger _callback_afterAd to game
      doGMLCallback(pCallbackAfterAd, { id: adId });
    },
    beforeReward: (showAdFn) => {
      // Show reward prompt (call showAdFn() if clicked)
      console.log("beforeReward");
      showAdFn();
      // Setup native prompt to indicate ad will load
      // Will not be setup by dev so this UX controlled by GXC
    },
    adDismissed: () => {
      // Player dismissed the ad before it finished
      console.log("adDismissed");
      // trigger _callback_adDismissed to game
      doGMLCallback(pCallbackAdDismissed, { id: adId });
    },
    adViewed: () => {
      // Player watched the ad–give them the reward.
      console.log("adViewed");
      // trigger _callback_adViewed to game
      doGMLCallback(pCallbackAdViewed, { id: adId });
    },
    adBreakDone: (placementInfo) => {
      // Always called (if provided) even if an ad didn't show
      console.log("adBreakDone");
      // trigger _callback_adBreakDone to game
      doGMLCallback(pCallbackAdBreakDone, { id: adId });
      triggerAdPostfix(pRValueCopy);
    },
  });
}

function ensureAspectRatio() {
  if (canvasElement === undefined) {
    return;
  }

  if (!CHANGE_ASPECT_RATIO) {
    return;
  }

  if (startingHeight === undefined && startingWidth === undefined) {
    return;
  }

  canvasElement.classList.add("active");

  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight;
  var newHeight, newWidth;

  // Find the limiting dimension.
  var heightQuotient = startingHeight / maxHeight;
  var widthQuotient = startingWidth / maxWidth;

  if (heightQuotient > widthQuotient) {
    // Max out on height.
    newHeight = maxHeight;
    newWidth = newHeight * startingAspect;
  } else {
    // Max out on width.
    newWidth = maxWidth;
    newHeight = newWidth / startingAspect;
  }

  canvasElement.style.height = newHeight + "px";
  canvasElement.style.width = newWidth + "px";
}

function pause() {
  // Don't change the name - GX Mobile calls it when the app becomes inactive.
  if (!canvasElement.classList.contains("active")) {
    // Wait for the canvas to load.
    return;
  }

  GM_pause();
  pauseMenu.hidden = false;
  canvasElement.classList.add("paused");
}

function resume() {
  GM_unpause();
  pauseMenu.hidden = true;
  canvasElement.classList.remove("paused");
  canvasElement.classList.add("unpaused");
  enterFullscreenIfSupported();
  lockOrientationIfSupported();
}

function quitIfSupported() {
  if (window.oprt && window.oprt.closeTab) {
    /* GX Mobile API */
    window.oprt.closeTab();
  } else if (
    window.chrome &&
    window.chrome.runtime &&
    window.chrome.runtime.sendMessage
  ) {
    window.chrome.runtime.sendMessage("mpojjmidmnpcpopbebmecmjdkdbgdeke", {
      command: "closeTab",
    });
  }
}

function enterFullscreenIfSupported() {
  if (!window.oprt || !window.oprt.enterFullscreen) {
    /* GX Mobile API */
    return;
  }

  window.oprt.enterFullscreen();
  let viewStatus = GM_get_view_status();
  viewStatus.fullscreen = true;
  GM_set_view_status(viewStatus);
}

function lockOrientationIfSupported() {
  if (
    !window.oprt ||
    !window.oprt.lockPortraitOrientation ||
    !window.oprt.lockLandscapeOrientation
  ) {
    /* GX Mobile API */
    return;
  }

  let viewStatus = GM_get_view_status();
  if (viewStatus.landscape === true && viewStatus.portrait === false) {
    window.oprt.lockPortraitOrientation();
  } else if (viewStatus.landscape === false && viewStatus.portrait === true) {
    window.oprt.lockPortraitOrientation();
  }
}

/* Observe the dimensions of body and ensureAspectRatio of the canvas (whilst taking up maximum space)
 *
 * NOTE(robertz):
 *  We also need to request an Animation Frame to do this, if we do not, resizeObserver might throw error
 *  "ResizeObserver loop limit exceeded", which means that
 *  "[...] ResizeObserver was not able to deliver all observations within a single animation frame"
 *  https://stackoverflow.com/a/50387233 (source).
 *
 *  There are different ways to solve the issue, since the error is benign (meaning it wont crash anything)
 *  we could choose to ignore it via changing the window.onerror method, i.e
 *  ```
 *  window.onerror((event)=> {
 *    if(event==="ResizeObserver loop limit exceeded") {
 *       return
 *    }
 *     ///...rest
 *  }
 *  ```
 *  But for now we request an animationFrame which seems to be the recommended way to go about it.
 *
 * NOTE(ddrechny):
 *  window.innerWidth/Height value updates are sometimes delayed in WebKit on iOS after an orientation
 *  change. Hence we're calling ensureAspectRatio one more time after a delay to minimize the risk of
 *  sizing the canvas with outdated values.
 */
const resizeObserver = new ResizeObserver(() => {
  window.requestAnimationFrame(ensureAspectRatio);
  setTimeout(() => window.requestAnimationFrame(ensureAspectRatio), 100);
});
resizeObserver.observe(document.body);

/* NOTE(ddrechny):
 *  Body needs to be scrollable on desktop browsers for debug buttons to be accessible.
 *  On mobile browsers scrolling can be activated accidentally and debug buttons aren't useful,
 *  so it's better to disable it.
 */
if (/Android|iPhone|iPod/i.test(navigator.userAgent)) {
  bodyElement.className = "scrollingDisabled";
  canvasElement.classList.add("animatedSizeTransitions");
  outputContainerElement.hidden = true;
}

document.addEventListener("visibilitychange", (event) => {
  if (document.visibilityState != "visible") {
    pause();
  }
});

window.addEventListener("load", (event) => {
  if (
    (!window.oprt || !window.oprt.enterFullscreen) &&
    (!window.chrome ||
      !window.chrome.runtime ||
      !window.chrome.runtime.sendMessage)
  ) {
    quitButton.hidden = true;
  }
});

setWadLoadCallback(() => {
  enterFullscreenIfSupported();
  lockOrientationIfSupported();
});
