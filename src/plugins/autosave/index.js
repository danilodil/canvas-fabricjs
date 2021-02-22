const autoSave = {

  timer: null,
  interval: 5000,
  currentCanvas: null,
  canvas: null,

  init(canv, int) {

    if (int) this.interval = int;
    if (canv) this.canvas = canv;

    this.timer = setInterval(() => {
      this.currentCanvas = JSON.stringify(this.canvas);
      localStorage.setItem('canvas', this.currentCanvas);
    }, this.interval)
  },

  destroy() {
    if (this.timer) clearInterval(this.timer);
  },

  getData() {
    this.canvas.clear().renderAll();
    this.canvas.loadFromJSON(localStorage.getItem('canvas'), () => {
      this.canvas.renderAll();
    });
  }
}

export default autoSave;