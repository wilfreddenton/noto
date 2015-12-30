import React, { PropTypes, Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/example-button.scss'

@CSSModules(styles)
export default class ExampleButton extends Component {
  static propTypes = {
    exampleAction: PropTypes.func.isRequired
  }
  render() {
    let { exampleAction } = this.props
    return (
      <button onClick={exampleAction} styleName="example-button">example</button>
    )
  }
}

