var React = require('react');
var addons = require('react-addons');
var ReactDOM = require('react-dom');
var MyForm = require('./myForm.jsx');

ReactDOM.render(
  <MyForm
          col="3"
          name="陈永仁"
          doc="黄警官"
          time="18:00-18:30" />,
  document.getElementById('box')
);
ReactDOM.render(
  <MyForm
          col="4"
          name="刘建明"
          doc="韩琛"
          time="12:00-12:30" />,
  document.getElementById('box2')
);
Perf = addons.Perf;
