import TransitionScene from "./TransitionScene";
import {ClippedLayer} from "./clippedlayers";

/**
 * シーン遷移にclipを使う
 * @example
 * phina.define('MyClippedTransitionScene', {
 *   superClass: phina.display.ClippedTransitionScene
 *   init: function(options) {
 *     options.clippedLayer = phina.createClass({
 *       superClass: phina.display.ClippedLayer,
 *       init: function(options) {
 *         this.superInit(options);
 *         todo
 *       },
 *       clip: function(canvas) {
 *         todo
 *       },
 *       openClip: function() {
 *         todo
 *       },
 *       closeClip: function(cb) {
 *         todo
 *         cb()
 *       },
 *     });
 *
 *     this.superInit(options)
 *   }
 * })
 */

export default phina.define('phina.display.ClippedTransitionScene', {
  superClass: TransitionScene,

  init(options) {
    this.superInit(options);
    const layerClass = options.layerClass || ClippedLayer;
    this.clippedLayer = layerClass.apply(null, arguments);

    // this.superMethod('addChild', this.clippedLayer); // superMethodが上手く動かない...
    phina.app.Element.prototype.addChild.call(this, this.clippedLayer);
  },

  open() {
    this.clippedLayer.openClip();
  },

  close() {
    return phina.util.Flow(function(resolve) {
      this.clippedLayer.closeClip(resolve);
    }.bind(this))
  },

  /**
   * childはclippedLayerに追加・削除するようオーバーライド
   */
  addChild(child) {
    if (child.parent) child.remove();

    child.parent = this.clippedLayer;
    this.clippedLayer.children.push(child);

    child.has('added') && child.flare('added');

    return child;
  },

  removeChild(child) {
    const index = this.clippedLayer.children.indexOf(child);
    if (index !== -1) {
      this.clippedLayer.children.splice(index, 1);
      child.has('removed') && child.flare('removed');
    }
    return this;
  },

  // _accessor: {
    // children: {
    //   get: function() { return this.clippedLayer.children; }
    // }
  // },
});