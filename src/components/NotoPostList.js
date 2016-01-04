import React, { Component, PropTypes } from 'react'
import NotoPostListItem from './NotoPostListItem'

export default class NotoPostList extends Component {
  static propTypes = {
    posts: PropTypes.array
  }
  render() {
    let posts = this.props.posts.map((post, i) => {
      return <NotoPostListItem key={i} post={post} />
    })
    return (
      <div>
        {posts}
      </div>
    )
  }
}
