/**
 * トランジション用Scene
 * 英語的に正しくはTransitableScene?
 *
 * 基本的にはmanagerScene管理下の子sceneとして使う前提
 * extendしたらopen, closeメソッドを書き換えて使う
 *
 * @param  {TransitionSceneOptions} options
 */
export default phina.define('phina.display.TransitionScene', {
  superClass: 'phina.display.DisplayScene',

  init(options) {
    options = ({}).$safe(options || {}, phina.display.TransitionScene.defaults);
    this.superInit(options);

    // this._isOpening = false; // open/close関数はユーザー定義なのでフラグon/offが難しい
    this._isExiting = false;
    if (options.autoOpen) {
      this.one('enter', this.open.bind(this));
    }
  },

  /**
   * @virtual
   */
  open() { },

  /**
   * @virtual
   * flow(promise)を返すことを推奨
   * @return {void|phina.util.Flow|Promise}
   */
  close() {
    return phina.util.Flow(function(resolve) {
      resolve();
    });
    // plan B: イベントで終了をフックする？
    // doSomethingThenCallback(function() {
    //   this.flare('sceneClosed');
    // }.bind(this))
  },

  /**
   * @override
   * @param  {string} nextLabel
   * @param  {any} nextArguments
   * @return {this}
   */
  exit(nextLabel, nextArguments) {
    if (!this.app) return ;
    if (this._isExiting) return ;

    // 閉じてる最中はexitを実行しないように
    this._isExiting = true;

    if (arguments.length > 0) {
      if (typeof arguments[0] === 'object') {
        nextLabel = arguments[0].nextLabel || this.nextLabel;
        nextArguments = arguments[0];
      }
      this.nextLabel = nextLabel;
      this.nextArguments = nextArguments;
    }

    // close処理が終わったら
    var closeResult = this.close();
    if (closeResult && closeResult.then) {
      closeResult.then(function() {
        this._isExiting = false;
        this.app.popScene();
        // this.superMethod('exit', nextLabel, nextArguments);
      }.bind(this));
    } else {
      // close()がflowを返さなかった場合
      this._isExiting = false;
      this.app.popScene();
    }

    return this;
  },

  _static: {
    defaults: {
      autoOpen: true,
    },
  }

});