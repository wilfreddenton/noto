import React, { PropTypes, Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ExampleButton from './ExampleButton'
import Noto from './Noto'
import * as ExampleActions from '../actions/example'

@connect(state => ({ example: state.example }))
export default class Home extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    example: PropTypes.any
  }
  render() {
    let { dispatch } = this.props
    //<p>{this.props.example.toString()}</p>
    //<ExampleButton {...bindActionCreators(ExampleActions, dispatch)} />
    return (
      <div data-component="home">
        <h1 style={{color: "#F80000"}}>nōto</h1>
        <Noto />
      </div>
    )
  }
}

