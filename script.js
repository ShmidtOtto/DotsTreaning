(() => {
  const cnv = document.querySelector("canvas");
  const ctx = cnv.getContext("2d");
  let cw, ch, cx, cy;

  function resizeCanvas() {
    cw = cnv.width = innerWidth;
    ch = cnv.height = innerHeight;
    cx = cw / 2;
    cy = ch / 2;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  const cfg = {
    hue: 0,
    bgfFillColor: "rgba(50, 50, 50, .05)",
    dirsCount: 4,
    stepsToTurn: 20,
    dotSize: 6,
    dotsCount: 300,
    dotVelocety: 2,
    distance: 70,
    gradiantLength: 5,
    gridAngel: 45
  }
  function drawRect(color, x, y, w, h, shadowColor, shadowBlur, gco){
    ctx.globalCompositionOperation = gco;
    ctx.shadowColor = shadowColor || "black";
    ctx.shadowBlur = shadowBlur || 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

  }
  class Dot {
    constructor(){
      this.pos = {
        x: cx,
        y: cy
      };
      this.dir = Math.random() * cfg.dirsCount | 0;
      this.step = 0;
    }
    redrawDot(){
      let xy = Math.abs(this.pos.x - cx) + Math.abs(this.pos.y - cy);
      let makeHue = (cfg.hue + xy / cfg.gradiantLength) % 360;
      let blur = cfg.dotSize - Math.sin(xy / 8) * 2;
      let color = `hsl(${ makeHue }, 100%, 50%)`;
      let size = cfg.dotSize //- Math.sin(xy / 9) * 2 - Math.sin(xy / 2);
      let x = this.pos.x - size / 2;
      let y = this.pos.y - size / 2;
      drawRect(color, x, y, size, size, color, blur, "lighter");
    }
    moveDot(){
      this.step ++;
      this.pos.x += dirsList[this.dir].x * cfg.dotVelocety;
      this.pos.y += dirsList[this.dir].y * cfg.dotVelocety;
    }
    changeDir(){
      if(this.step % cfg.stepsToTurn === 0){
        this.dir = Math.random() > .5 ? (this.dir + 1) % cfg.dirsCount : (this.dir + cfg.dirsCount - 1) % cfg.dirsCount;
      }
    }
    killDot(index){
      let persent = Math.random() * Math.exp(this.step / cfg.distance);
      if(persent > 100){
        dotsList.splice(index, 1);
      }
    }
  }
  let dirsList = [];

  function createDirs(){
    for(let i = 0; i < 360; i += 360 / cfg.dirsCount){
      let angel = cfg.gridAngel + i;
      let x = Math.cos(angel * Math.PI / 180);
      let y = Math.sin(angel * Math.PI / 180);
      dirsList.push({
        x: x,
        y: y
      });
    }
  }
  createDirs();
  let dotsList = [];
  function addDot(){
    if(dotsList.length < cfg.dotsCount && Math.random() > .8){
      dotsList.push(new Dot());
      cfg.hue = (cfg.hue + 1) % 360;

    }
  }
  function refreshDots(){
    dotsList.forEach((el, index) => {
      el.moveDot();
      el.redrawDot();
      el.changeDir();
      el.killDot(index);
    });

  }

  function loop(){
    drawRect(cfg.bgfFillColor, 0, 0, cw, ch, 0, 0);
    addDot();
    refreshDots();
    requestAnimationFrame(loop);
  }
  loop();
})();
