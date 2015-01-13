'use strict';

var React = require('react');

var IconCheck = React.createClass({
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
      <svg className="checkmark" width={this.props.width} height={this.props.height}>
        <path d="m31.5,46.5l15.3,-23.2"/>
        <path d="m31.5,46.5l-8.5,-7.1"/>
      </svg>
    );
  }
});

module.exports = IconCheck;
