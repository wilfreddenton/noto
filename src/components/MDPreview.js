import React, { PropTypes, Component } from 'react'
import marked from 'marked'

export default class MDPreview extends Component {
  static propTypes = {
    markdown: PropTypes.string
  }
  markup() {
    return { __html: marked(this.props.markdown) }
  }
  render() {
    return (
      <div dangerouslySetInnerHTML={this.markup()} />
    )
  }
}

