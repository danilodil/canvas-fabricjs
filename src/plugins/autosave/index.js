const autoSave = {

  timer: null,
  interval: 5000,
  currentCanvas: null,
  canvas: null,
  autoSave: false,

  init(canv, auto, int) {

    if (int) this.interval = int;
    if (canv) this.canvas = canv;
    if (auto) this.autoSave = auto;

    if (auto) {
      this.timer = setInterval(() => {
        try {
          localStorage.setItem('canvas', JSON.stringify(this.canvas));
        } catch (e) {
          console.log(e)
        }
      }, this.interval)
    }
  },

  destroy() {
    if (this.timer) clearInterval(this.timer);
  },

  getData() {
    this.canvas.clear().renderAll();
    this.canvas.loadFromJSON(localStorage.getItem('canvas'), () => {
      this.canvas.renderAll();
    });
  },

  getCanvas(){
    return this.canvas;
  },

  save() {
    try {
      localStorage.setItem('canvas', JSON.stringify(this.canvas));
    } catch (e) {
      console.log(e)
    }
  },

  clear() {
    localStorage.setItem('canvas', []);
  }
}

export default autoSave;