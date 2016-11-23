var React = require('react');
var addons = require('react-addons');
var ReactDOM = require('react-dom');
var MyInput = require('./myInput.jsx');
var MyButton = require('./Button.jsx');
var DragArea = require('./DragArea.jsx');

var MyForm = React.createClass({

  getInitialState: function() {

    return {
      username: "",
      password: "",
      checked: true,
      left: 0,
      top: 0,
      currentX: 0,
      currentY: 0,
      flag: false,

      col: 0,
      DRBOXWIDTH: 0,
      colWidth: 0,
      spWidth: 0
    };
  },
  onChildChanged: function(newState) {
    /*以下为修改处*/
    var computedStyle = document.defaultView.getComputedStyle(ReactDOM.findDOMNode(this.refs.dragBox), null);
    newState.left = computedStyle.left;
    newState.top = computedStyle.top;
    /*以上为修改处*/
    this.setState(newState);
  },
  handleChange: function(event) {
    var newState = {};
    var name = event.target.name;
    newState[name] = name == "checked" ? event.target.checked : event.target.value;
    this.setState(newState);
  },
  submitHandler: function(event) {
    event.preventDefault();
    console.log(this.state);
  },
  move: function(event) {

    let DRBOXWIDTH = this.state.DRBOXWIDTH;
    let colWidth = this.state.colWidth;
    let spWidth = this.state.spWidth;
    var e = event ? event : window.event;
    var dBox = ReactDOM.findDOMNode(this.refs.dragBox);
    if (this.state.flag) {
      var nowX = e.clientX,
        nowY = e.clientY;
      var disX = nowX - this.state.currentX,
        disY = nowY - this.state.currentY;
      /*增加拖拽范围检测*/
      var currentLeft = parseInt(this.state.left) + disX;
      var currentTop = parseInt(this.state.top) + disY;
      var docX = document.documentElement.clientWidth || document.body.clientWidth;
      var docY = document.documentElement.clientHeight || document.body.clientHeight;
      var midWith = DRBOXWIDTH,
        midHeight = 200;
      console.log("currentLeft:" + currentLeft)
      console.log("docX:" + docX)
      console.log("disX:" + disX)
      console.log("nowX:" + nowX)
      console.log("-------------------")

      if (currentLeft <= midWith) { //检测屏幕左边，因为我这里的初始居中是利用了负1/2的盒子宽度，所以用250px判断边界
        dBox.style.left = DRBOXWIDTH + spWidth + "px";
      } else {
        dBox.style.left = currentLeft + "px";
      }

      console.log("dBox.style.left :" + dBox.style.left)
      console.log("**********************")

      if (currentTop <= midHeight) { //检测屏幕上边，因为我这里的初始居中是利用了负1/2的盒子高度，所以用200px判断边界
        dBox.style.top = midHeight + 30 + "px";
      } else if (currentTop >= (docY - dBox.offsetHeight + midHeight)) {
        dBox.style.top = (docY - this.state.offsetY) + "px";
      } else {
        dBox.style.top = currentTop - 30 + "px";
      }

      dBox.className = "form-horizontal form rotate30";
    }
  },
  endDrag: function() {
    let DRBOXWIDTH = this.state.DRBOXWIDTH;
    let colWidth = this.state.colWidth;
    let spWidth = this.state.spWidth;
    var computedStyle = document.defaultView.getComputedStyle(ReactDOM.findDOMNode(this.refs.dragBox), null);
    var dBox = ReactDOM.findDOMNode(this.refs.dragBox);
    let left;
    if (computedStyle.left.replace("px", "") >= DRBOXWIDTH &&
      computedStyle.left.replace("px", "") < 0.5 * DRBOXWIDTH + colWidth)
      left = DRBOXWIDTH + spWidth + "px";
    if (computedStyle.left.replace("px", "") >= 0.5 * DRBOXWIDTH + colWidth &&
      computedStyle.left.replace("px", "") < 0.5 * DRBOXWIDTH + 2 * colWidth)
      left = DRBOXWIDTH + spWidth + colWidth + "px";
    if (computedStyle.left.replace("px", "") >= 0.5 * DRBOXWIDTH + 2 * colWidth &&
      computedStyle.left.replace("px", "") < 0.5 * DRBOXWIDTH + 3 * colWidth)
      left = DRBOXWIDTH + spWidth + colWidth + colWidth + "px";
    if (computedStyle.left.replace("px", "") >= 0.5 * DRBOXWIDTH + 3 * colWidth)
      left = DRBOXWIDTH + spWidth + colWidth + colWidth + colWidth + "px";
    this.setState({
      left: computedStyle.left,
      top: computedStyle.top,
      flag: false
    });
    dBox.style.left = left;

    dBox.className = "form-horizontal form";
  },
  /*
  组件被装载后才会被调用，也就是说调用这个方法的时候，
  组件已经被渲染到了页面上，
  这个时候可以修改DOM。
  此时把相应的docume事件绑定到上面
  */
  componentDidMount: function() {

    var COL = this.props.col; //分成4栏还是3栏
    const DRBOXWIDTH = 200; //拖拽框的宽度

    let colWidth = 0;
    if (COL == 4) {
      colWidth = $(".col-md-3").innerWidth() + 2;
    } else if (COL == 3) {
      colWidth = $(".col-md-4").innerWidth() + 2;
    } //330 //2px是col之间的分隔线
    let spWidth = (colWidth - DRBOXWIDTH) / 2; //40 两边各自间距(padding-left)

    this.setState({
      col: COL,
      DRBOXWIDTH: DRBOXWIDTH,
      colWidth: colWidth,
      spWidth: spWidth
    });
    var o = this;
    document.addEventListener('mousedown', function() {
      document.addEventListener('mousemove', (e) => {
        o.move(e);
      }, false); /*ES6新特性，箭头函数，需要依赖jsx编译工具才能正确运行*/
      document.addEventListener('mouseup', (e) => {
        o.endDrag(e);
      }, false);
    })


    $(".form").css({
      "width": DRBOXWIDTH + "px",
      "margin-left": -DRBOXWIDTH + "px"
    });
    $("#box .form").css({
      "top": "73%",
    });
    $("#box2 .form").css({
      "top": "33%",
    });
  },

  render: function() {
    return (
      <form
            className="form-horizontal form"
            ref="dragBox"
            onSubmit={ this.submitHandler }>
        <DragArea
                  callbackParent={ this.onChildChanged }
                  col={ this.props.col } />
        <p style={ { margin: "70px 0 0 20px" } }>
          { this.props.name }
        </p>
        <span style={ { padding: "0 0 0 20px" } }>{ this.props.doc }</span>
        <span style={ { padding: "0 0 0 40px" } }>{ this.props.time }</span>
      </form>
      );
  }
});
module.exports = MyForm;