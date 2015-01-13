'use strict';

var React = require('react');
var emptyFn = require('react/lib/emptyFunction');
var keyMirror = require('react/lib/keyMirror');
var cx = require('react/lib/cx');
var EventListener = require('react/lib/EventListener');

// Components
var CircularProgressIndicator = require('./CircularProgressIndicator.jsx');
var IconCheck = require('./IconCheck.jsx');
var IconCross = require('./IconCross.jsx');

// Constants
var RESULT_STATES = keyMirror({
  ERROR: null,
  INDETERMINATE: null,
  SUCCESS: null
});

var CircularProgressButton = React.createClass({
  statics: {
    ERROR: RESULT_STATES.ERROR,
    INDETERMINATE: RESULT_STATES.INDETERMINATE,
    RESULT_STATES: RESULT_STATES,
    SUCCESS: RESULT_STATES.SUCCESS
  },
  propTypes: {
    disabled: React.PropTypes.bool,
    height: React.PropTypes.number,
    loading: React.PropTypes.bool.isRequired,
    onClick: React.PropTypes.func.isRequired,
    progress: React.PropTypes.number.isRequired,
    result: React.PropTypes.oneOf(Object.keys(RESULT_STATES)).isRequired,
    width: React.PropTypes.number
  },
  getDefaultProps: function() {
    return {
      height: 70,
      onClick: emptyFn,
      result: RESULT_STATES.INDETERMINATE,
      width: 70
    };
  },
  getInitialState: function() {
    return {
      loading: false,
      result: RESULT_STATES.INDETERMINATE,
      disabled: false,
      progress: 0
    };
  },
  _deferredState: {
    loading: null,
    progress: null
  },
  componentDidMount: function() {
    this.transEnd = EventListener.listen(this.refs.button.getDOMNode(), 'transitionend', this.onTransitionEnd);
  },
  componentWillUpdate: function(nextProps, nextState) {
    if(nextProps.loading !== this.state.loading) {
      if(nextProps.loading) {
        // Changed from "not loading" to "loading"
        // Reset progress to 0% and defer the progress indicator until after
        // the "loading" transition animation has completed
        nextState.loading = nextProps.loading;
        nextState.progress = 0;
        this._deferredState.progress = nextProps.progress;
      } else {
        // Changed from "loading" to "not loading"
        // Reset progress to 100%
        nextState.progress = 1;
      }
    } else if(nextProps.result === RESULT_STATES.INDETERMINATE && nextProps.result !== this.props.result) {
      // Changed from a completed state to indeterminate state which likely
      // means that the async action this component manages has been
      // re-attempted which means all states need to be reset
      nextState.loading = nextProps.loading = false;
      nextState.progress = nextProps.progress = 0;
      nextState.result = nextProps.result;
    } else if(this.state.loading && nextProps.progress !== this.state.progress) {
      // Loading progress has advanced
      nextState.progress = nextProps.progress
    }
  },
  onTransitionEnd: function(e) {
    if(e.propertyName !== 'width') {
      return false;
    }
    this.setState({
      progress: this._deferredState.progress || 0
    });
    this._deferredState.progress = null;
  },
  handleClick: function(e) {
    if(!this.state.loading) {
      this.props.onClick(e);
    }
  },
  onProgressChanged: function(progress) {
    if(progress >= 1) {
      this.setState({
        loading: false,
        result: this.props.result
      });
    }
  },
  render: function() {
    var disabled = this.props.disabled || this.state.loading;
    var cls = cx({
      'progress-button': true,
      'loading': this.state.loading,
      'success': this.state.result === RESULT_STATES.SUCCESS,
      'error': this.state.result === RESULT_STATES.ERROR
    });
    return (
      <div className={cls} onClick={this.handleClick}>
        <button ref="button" disabled={disabled}>
          <span>{this.props.children}</span>
        </button>
        <CircularProgressIndicator
          height={this.props.height}
          loading={this.state.loading}
          onProgressChanged={this.onProgressChanged}
          progress={this.state.progress}
          width={this.props.width}
        />
        <IconCheck width={this.props.width} height={this.props.height}/>
        <IconCross width={this.props.width} height={this.props.height}/>
      </div>
    );
  }
});

module.exports = CircularProgressButton;
