'use strict';

var React = require('react');
var emptyFn = require('react/lib/emptyFunction');
var EventListener = require('react/lib/EventListener');

var CircularProgressIndicator = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    progress: React.PropTypes.number.isRequired,
    onProgressChanged: React.PropTypes.func
  },
  getDefaultProps: function() {
    return {
      width: 70,
      height: 70,
      progress: 0,
      onProgressChanged: emptyFn
    };
  },
  getInitialState: function() {
    return {
      progress: 0,
      strokeDasharray: 0,
      strokeDashoffset: 0
    };
  },
  componentDidMount: function() {
    var path = this.refs.path.getDOMNode();
    var pathLength = path.getTotalLength();
    this.setState({
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
    });
    this.handleTransitionEnd = EventListener.listen(this.getDOMNode(), 'transitionend', this.onProgressChanged);
  },
  componentWillUpdate: function(nextProps, nextState) {
    if(nextProps.progress !== this.props.progress) {
      if(nextProps.progress === 0) {
        nextState.progress = 0;
        nextState.strokeDashoffset = this.state.strokeDasharray;
      } else if(this.state.progress < nextProps.progress) {
        nextState.progress = nextProps.progress;
        nextState.strokeDashoffset = this.state.strokeDasharray * (1 - this.state.progress);
      } else {
        // A progress update has occurred out of order. This can happen if the
        // the change in progress occurs faster than React's render loop
        if(process.env.NODE_ENV !== 'production') {
          console.warn(
            '%s: Skipping update, progress change occurred out of order (Changed from %f to %f)',
            this.constructor.displayName,
            this.props.progress,
            nextProps.progress
          );
        }
      }
    }
  },
  componentDidUnmount: function() {
    this.handleTransitionEnd.remove();
  },
  onProgressChanged: function(e) {
    if(e.propertyName === 'stroke-dashoffset') {
      this.props.onProgressChanged(this.state.progress);
    }
  },
  render: function() {
    var progressStyle = {
      strokeDasharray: this.state.strokeDasharray,
      strokeDashoffset: this.state.strokeDashoffset
    };
    return (
      <svg className="progress-circle" width={this.props.width} height={this.props.height}>
        <path ref="path" d="m35,2.5c17.955803,0 32.5,14.544199 32.5,32.5c0,17.955803 -14.544197,32.5 -32.5,32.5c-17.955803,0 -32.5,-14.544197 -32.5,-32.5c0,-17.955801 14.544197,-32.5 32.5,-32.5z" style={progressStyle}/>
      </svg>
    );
  }
});

module.exports = CircularProgressIndicator;
