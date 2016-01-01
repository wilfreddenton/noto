import React, { PropTypes, Component } from 'react'
import marked from 'marked'
import katex from 'katex'

export default class MDPreview extends Component {
  static propTypes = {
    markdown: PropTypes.string
  }
  constructor(props) {
    super(props)
    this.katexParser = this.katexParser.bind(this)
  }
  katexParser(string) {
    return string.replace(/\$\$\s((?!\$\$)[^])*\s\$\$/g, (match, text, id) => {
      const latex = match.slice(2, -2)
      return katex.renderToString(latex)
    })
  }
  markup() {
    let markdown = this.katexParser(this.props.markdown)
    return { __html: marked(markdown) }
  }
  render() {
    return (
      <div dangerouslySetInnerHTML={this.markup()} />
    )
  }
}

