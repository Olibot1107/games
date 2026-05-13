// const imageRoutes = {
//   z: "/imgs/fake/safri.jpeg",
//   x: "/imgs/fake/bedrock.jpeg",
//   c: "/imgs/fake/sparxmath.jpeg",
//   v: "/imgs/fake/sparxscience.jpeg",
// };

// // 🔥 in-memory cache (fastest possible)
// const imageCache = {};

// let overlay = null;
// let imageActive = false;

// let recentKeys = [];
// const COMBO_WINDOW = 1000;

// // --------------------
// // PRELOAD IMAGES
// // --------------------
// function preloadImages() {
//   for (const key in imageRoutes) {
//     const img = new Image();
//     img.src = imageRoutes[key];
//     imageCache[key] = img; // store loaded image element
//   }
// }

// preloadImages();

// // --------------------
// // FULLSCREEN CONTROL
// // --------------------
// function enterFullscreen() {
//   if (!document.fullscreenElement) {
//     document.documentElement.requestFullscreen().catch(console.error);
//   }
// }

// function exitFullscreen() {
//   if (document.fullscreenElement) {
//     document.exitFullscreen().catch(console.error);
//   }
// }

// // --------------------
// // SHOW IMAGE (cached)
// // --------------------
// function showImage(key) {
//   removeImage();

//   const cachedImg = imageCache[key];

//   overlay = document.createElement("div");
//   Object.assign(overlay.style, {
//     position: "fixed",
//     inset: "0",
//     background: "black",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: "999999"
//   });

//   const img = cachedImg || new Image();
//   img.src = imageRoutes[key];

//   Object.assign(img.style, {
//     width: "100%",
//     height: "100%",
//     objectFit: "contain"
//   });

//   overlay.appendChild(img);
//   document.body.appendChild(overlay);
//   imageActive = true;
// }

// function removeImage() {
//   if (overlay) overlay.remove();
//   overlay = null;
//   imageActive = false;
// }

// // --------------------
// // KEY LOGIC
// // --------------------
// function cleanRecent() {
//   const now = Date.now();
//   recentKeys = recentKeys.filter(k => now - k.time < COMBO_WINDOW);
// }

// document.addEventListener("keydown", (e) => {
//     const tag = event.target.tagName;
//   const isTyping =
//     tag === "INPUT" ||
//     tag === "TEXTAREA" ||
//     event.target.isContentEditable;

//   if (isTyping) return;
//   const key = e.key.toLowerCase();
//   const now = Date.now();

//   cleanRecent();
//   recentKeys.push({ key, time: now });

//   // EXIT IMAGE MODE
//   if (imageActive && key === "`") {
//     removeImage();
//     return;
//   }

//   if (key === "`") {
//     setTimeout(() => {
//       const combo = recentKeys.find(
//         k =>
//           imageRoutes[k.key] &&
//           Math.abs(k.time - now) <= COMBO_WINDOW
//       );

//       if (combo) {
//         showImage(combo.key);
//       } else {
//         if (!document.fullscreenElement) {
//           enterFullscreen();
//         } else {
//           exitFullscreen();
//         }
//       }
//     }, 120);
//   }
// });

document.addEventListener("keydown", (event) => {
  // Ignore if user is typing in an input/textarea/contenteditable
  const tag = event.target.tagName;
  const isTyping =
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    event.target.isContentEditable;

  if (isTyping) return;

  if (event.key === "/") {
    event.preventDefault();
    window.location.href = "/";
  }

  if (event.key === "`") {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    } else {
      document.documentElement.requestFullscreen().catch(console.error);
    }
  }
});