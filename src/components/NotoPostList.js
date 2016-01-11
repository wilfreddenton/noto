import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import NotoPostListItem from './NotoPostListItem'

export default class NotoPostList extends Component {
  static propTypes = {
    unique: PropTypes.string,
    children: PropTypes.object,
    posts: PropTypes.array,
    history: PropTypes.object
  }
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    window.addEvent
  }
  render() {
    let posts = this.props.posts.map((post, i) => {
      const selected = this.props.unique === post.unique ? true : false
      return (
        <NotoPostListItem key={i} index={i} selected={selected} post={post} clickHandler={this.clickHandler} history={this.props.history} />
      )
    })
    return (
      <div>
        {posts}
      </div>
    )
  }
}
