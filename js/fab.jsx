const React = require('react');
const ReactDOM = require('react-dom');
import { Link } from 'react-router'


export default React.createClass({
  displayName: 'fab',
  render: function() {
    return (
      <Link to={this.props.url} >
        <a className="fab btn-floating btn-large waves-effect waves-light red" >
          <i className="large material-icons">{this.props.icon}</i>
        </a>
      </Link>
    );
  }
});
