import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchPostsAction } from '../actions/posts'
import NotoPostList from './NotoPostList'

@connect(state => ({ posts: state.posts }))
export default class Noto extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    posts: PropTypes.array
  }
  componentWillMount() {
    this.props.dispatch(fetchPostsAction())
  }
  componentDidMount() {
  }
  render() {
    return (
      <NotoPostList posts={this.props.posts} />
    )
  }
}
