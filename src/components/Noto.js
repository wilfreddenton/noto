import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchPostsAction } from '../actions/posts'
import CSSModules from 'react-css-modules'
import NotoPostList from './NotoPostList'
import styles from '../styles/noto.scss'

@connect(state => ({ posts: state.posts }))
@CSSModules(styles)
export default class Noto extends Component {
  static propTypes = {
    params: PropTypes.object,
    dispatch: PropTypes.func,
    posts: PropTypes.array,
    history: PropTypes.object
  }
  componentWillMount() {
    this.props.dispatch(fetchPostsAction())
  }
  componentDidMount() {
  }
  render() {
    return (
      <div styleName="noto">
        <NotoPostList posts={this.props.posts} unique={this.props.params.unique} history={this.props.history} />
      </div>
    )
  }
}
