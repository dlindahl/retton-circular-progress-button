'use strict';

var React = require('react');
var cx = require('react/lib/cx');
var EventListener = require('react/lib/EventListener');

function fakeProgress( instance ) {
  var progress = 0;
  var interval;
  interval = setInterval(function() {
    progress = Math.min( progress + Math.random() * 0.1, 1 );
    instance.setProgress( progress );
    if(progress === 1) {
      instance.stop();// pos === 1 || pos === 3 ? -1 : 1 );
      clearInterval( interval );
    }
  }, 150);
}

var CircularProgressButton = React.createClass({
  getInitialState: function() {
    return {
      loading: false, // TODO: Replace with prop
      success: false,
      error: false,
      disabled: false,
      strokeDasharray: 0,
      strokeDashoffset: 0
    };
  },
  componentDidMount: function() {
    this.transEnd = EventListener.listen(this.refs.button.getDOMNode(), 'transitionend', this.onTransitionEnd);
    var path = this.refs.progress.getDOMNode().querySelector('path');
    var pathLength = path.getTotalLength();
    this.setState({
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
    });
  },
  componentWillUnmount: function() {
    this.transEnd.remove();
  },
  onTransitionEnd: function(e) {
    if(e.propertyName !== 'width') {
      return false;
    }
    // if('callback') {
      fakeProgress(this);
    // } else {
    //   this.setState({ disabled: true });
    //   this.setProgress(1);
    // }
  },
  //
  setProgress: function(val) {
    this._draw('progress', val);
  },
  stop: function() {
    console.warn('STOP');
    this.setState({
      loading: false,
      // success: true,
      error: true
    });
  },
  //
  //
  _draw: function(ref, val) {
    this.setState({
      strokeDashoffset: this.state.strokeDasharray * (1 - val)
    });
  },
  //
  handleClick: function(e) {
    e.preventDefault();
    this.setState({ loading: !this.state.loading });
  },
  render: function() {
    var cls = cx({
      'progress-button': true,
      'loading': this.state.loading,
      'success': this.state.success,
      'error': this.state.error
    });
    var progressStyle = {
      strokeDasharray: this.state.strokeDasharray,
      strokeDashoffset: this.state.strokeDashoffset
    };
    return (
      <div className={cls} onClick={this.handleClick}>
        <button ref="button" disabled={this.state.disabled}><span>Submit</span></button>
        <svg ref="progress" className="progress-circle" width="70" height="70">
          <path d="m35,2.5c17.955803,0 32.5,14.544199 32.5,32.5c0,17.955803 -14.544197,32.5 -32.5,32.5c-17.955803,0 -32.5,-14.544197 -32.5,-32.5c0,-17.955801 14.544197,-32.5 32.5,-32.5z" style={progressStyle}/>
        </svg>
        <svg ref="success" className="checkmark" width="70" height="70"><path d="m31.5,46.5l15.3,-23.2"/><path d="m31.5,46.5l-8.5,-7.1"/></svg>
        <svg ref="error" className="cross" width="70" height="70"><path d="m35,35l-9.3,-9.3"/><path d="m35,35l9.3,9.3"/><path d="m35,35l-9.3,9.3"/><path d="m35,35l9.3,-9.3"/></svg>
      </div>
    );
  }
});

module.exports = CircularProgressButton;
