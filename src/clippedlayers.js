import phina from "phina.js";

/** abstract class */
export const ClippedLayer = phina.createClass({
  superClass: phina.display.DisplayElement,

  init(options) {
    this.superInit(options);
  },
  clip(c) {},
  openClip() {},
  closeClip(cb) { },

});

/**
 * 円形に閉じたり開いたりするclippedLayer
 */
const PI2 = Math.PI*2;
export const CircleClippedLayer = phina.createClass({
  superClass: ClippedLayer,

  init(options) {
    this.superInit(options);
    this._openedMaxRadius = Math.max(this.width, this.height)*1.25;
    this.clipCenter = phina.geom.Vector2(this.width*0.5, this.height*0.5);
    this.clipRadius = 20;
  },

  clip(c) {
    if (this.clipRadius === this._openedMaxRadius) return;
    if (this.clipRadius === 0) return;

    const cc = this.clipCenter;
    const cr = this.clipRadius;

    c.beginPath();
    c.arc(cc.x, cc.y, cr*1.5, 0, PI2, false);
    c.arc(cc.x, cc.y, cr*1.2, 0, PI2, true);
    c.arc(cc.x, cc.y, cr, 0, PI2, false);
  },

  openClip() {
    this.tweener.clear()
      .to({clipRadius: this._openedMaxRadius}, 1500, 'easeOutQuad')
  },

  closeClip(resolve) {
    this.tweener.clear()
      .to({clipRadius: 0}, 1000, 'easeInOutQuad')
      .call(resolve)
  },

});
