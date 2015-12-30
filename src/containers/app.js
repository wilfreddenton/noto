import React, { Component, PropTypes } from 'react'
import '../styles/global.css'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired
  }
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
