'use strict';

var React = require('react');

var IconCross = React.createClass({
  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number
  },
  getDefaultProps: function() {
    return {
      height: 70,
      width: 70
    };
  },
  render: function() {
    return (
      <svg className="cross" width={this.props.width} height={this.props.height}>
        <path d="m35,35l-9.3,-9.3"/>
        <path d="m35,35l9.3,9.3"/>
        <path d="m35,35l-9.3,9.3"/>
        <path d="m35,35l9.3,-9.3"/>
      </svg>
    );
  }
});

module.exports = IconCross;
