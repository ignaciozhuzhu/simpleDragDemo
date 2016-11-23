var React = require('react');
var addons = require('react-addons');
var ReactDOM = require('react-dom');

var DragArea = React.createClass({
  getInitialState: function() {
    return {
      left: 0,
      top: 0,
      currentX: 0,
      currentY: 0,
      flag: false
    }
  },
  startDrag: function(e) {
    var newState = {};
    var event = e || window.event;
    event.preventDefault();
    // var computedStyle=document.defaultView.getComputedStyle(dragBox,null);
    // newState.left=computedStyle.left;
    // newState.top=computedStyle.top;
    newState.currentX = event.clientX ;
    newState.currentY = event.clientY - 30;
    newState.flag = true;
    this.props.callbackParent(newState);
  },
  render: function() {
    return (
      <div
           className="drag"
           id="drag"
           onMouseDown={ this.startDrag }>
        拖这个部位(
        { this.props.col }等分)
      </div>
      );
  }
});

module.exports = DragArea;