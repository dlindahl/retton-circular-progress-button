'use strict';

var React = require('react');
var CircularProgressButton = require('../index.js');
var ProgressStore = require('./ProgressStore');
var el = document.getElementById('target');

var DemoButton = React.createClass({
  propTypes: {
    demo: React.PropTypes.oneOf(Object.keys(CircularProgressButton.RESULT_STATES))
  },
  componentWillMount: function() {
    this.store = new ProgressStore();
    this.store.on('change', this.handleChange);
    this.handleChange();
  },
  componentDidUpdate: function() {
    var self = this;
    if(this.state.progress >= 1) {
      setTimeout(function() {
        self.store.reset();
      }, 2000);
    }
  },
  handleChange: function() {
    this.setState(this.store.getState());
  },
  onClick: function(e) {
    e.preventDefault();
    this.store.simulate(3000, this.props.demo);
  },
  render: function() {
    return (
      <CircularProgressButton
        ref="button"
        onClick={this.onClick}
        progress={this.state.progress}
        loading={this.state.loading}
        result={this.state.result}
      >
        Go!
      </CircularProgressButton>
    );
  }
});

var App = React.createClass({
  render: function() {
    return (
      <div>
        <DemoButton demo={CircularProgressButton.SUCCESS}/>
        <DemoButton demo={CircularProgressButton.ERROR}/>
      </div>
    );
  }
});

React.render(<App/>, el);
