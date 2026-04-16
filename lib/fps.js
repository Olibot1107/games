(function() {
  'use strict';

  class FPSCounter {
    constructor(targetFPS = 60, updateInterval = 250) {
      this.targetFPS = targetFPS;
      this.updateInterval = updateInterval;
      this.frames = 0;
      this.lastTime = performance.now();
      this.lastUpdate = this.lastTime;
      this.fps = 0;
      this.el = this.create();
      this.loadPosition();
      this.enableDragging();
      this.enableFullscreenToggle(); // added
      this.start();
    }

    create() {
      const e = document.createElement('div');
      e.style.position = 'fixed';
      e.style.top = '10px';
      e.style.right = '10px';
      e.style.zIndex = '999999';
      e.style.background = 'rgba(0, 0, 0)';
      e.style.color = '#fff';
      e.style.padding = '5px 10px';
      e.style.fontFamily = 'monospace';
      e.style.fontSize = '14px';
      e.style.borderRadius = '5px';
      e.style.cursor = 'move';
      e.style.userSelect = 'none';
      e.style.pointerEvents = 'auto';
      document.body.appendChild(e);
      return e;
    }

    getColor(fps) {
      if (fps >= this.targetFPS * 0.9) return '#00FF00';
      if (fps >= this.targetFPS * 0.7) return '#FFFF00';
      return '#FF0000';
    }

    update() {
      this.frames++;
      const now = performance.now();
      const delta = now - this.lastUpdate;

      if (delta >= this.updateInterval) {
        const elapsed = now - this.lastTime;
        this.fps = Math.round((this.frames * 1000) / elapsed);
        this.frames = 0;
        this.lastTime = now;
        this.lastUpdate = now;
        this.render();
      }
    }

    render() {
      this.el.textContent = `FPS: ${this.fps}`;
      this.el.style.color = this.getColor(this.fps);
    }

    start() {
      const loop = () => {
        this.update();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    // --- Fullscreen toggle ---
    enableFullscreenToggle() {
      document.addEventListener('keydown', (e) => {
        const tag = document.activeElement?.tagName;

        // ignore typing in inputs
        if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;

        if (e.key === '`') {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
        }
      });
    }

    // --- Position handling ---
    savePosition(x, y) {
      document.cookie = `fpsPosition=${x},${y}; path=/; max-age=${60 * 60 * 24 * 30}`;
    }

    loadPosition() {
      const match = document.cookie.match(/fpsPosition=([^;]+)/);
      if (match) {
        const [x, y] = match[1].split(',').map(Number);
        this.el.style.left = `${x}px`;
        this.el.style.top = `${y}px`;
        this.el.style.right = 'auto';
      }
    }

    enableDragging() {
      let offsetX = 0, offsetY = 0, dragging = false;

      const onMouseDown = (e) => {
        dragging = true;
        const rect = this.el.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        e.preventDefault();
      };

      const onMouseMove = (e) => {
        if (!dragging) return;
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        this.el.style.left = `${x}px`;
        this.el.style.top = `${y}px`;
        this.el.style.right = 'auto';
      };

      const onMouseUp = () => {
        if (!dragging) return;
        dragging = false;
        const rect = this.el.getBoundingClientRect();
        this.savePosition(rect.left, rect.top);
      };

      this.el.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
  }

  new FPSCounter();
})();