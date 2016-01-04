import React, { Component, PropTypes } from 'react'

export default class NotoPostListItem extends Component {
  static propTypes = {
    post: PropTypes.object
  }
  render() {
    return (
      <h3>{this.props.post.title}</h3>
    )
  }
}
