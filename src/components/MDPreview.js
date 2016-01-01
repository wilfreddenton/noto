import React, { PropTypes, Component } from 'react'
import { findDOMNode } from 'react-dom'
import marked from 'marked'
import katex from 'katex'

export default class MDPreview extends Component {
  static propTypes = {
    markdown: PropTypes.string,
    cursorClickHandler: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.span = this.span.bind(this)
    this.debouncedSpan = _.debounce(this.span, 300)
    this.cursorClickHandler = this.cursorClickHandler.bind(this)
    this.katexParser = this.katexParser.bind(this)
  }
  cursorClickHandler(e) {
    let child = e.target
    let i = 0
    while ((child = child.previousSibling) !== null)
      i += 1
    child = e.target
    const eventLeft = e.clientX
    const childLeft = child.offsetLeft
    const childWidth = child.offsetWidth
    const childRight = childLeft + childWidth
    if (Math.abs(eventLeft - childLeft) > Math.abs(eventLeft - childRight)) {
      i += 1
    }
    this.props.cursorClickHandler(i, child)
  }
  span(ele) {
    // traverse dom and replace textContent with character span wrapped version
    let node = ele ? ele : findDOMNode(this)
    _.forEach(node.children, (child, i) => {
      let docFrag = document.createDocumentFragment()
      if (child.className.indexOf('katex') > -1 || child.tagName === 'SPAN') {
        return
      }
      if (!/<([a-zA-Z0-9]*)\b[^>]*>([^]*?)<\/\1>/.test(child.innerHTML)) {
        const text = child.innerHTML
        for (let j = 0; j < text.length; j += 1) {
          let span = document.createElement('span')
          span.innerHTML = text.charAt(j)
          span.onclick = this.cursorClickHandler
          docFrag.appendChild(span)
        }
        child.innerHTML = ''
        child.appendChild(docFrag)
      } else {
        if (child.tagName !== 'SPAN')
          this.span(child)
      }
    })
    return
  }
  katexParser(string) {
    return string.replace(/\$\$\s*((?!\$\$)[^])*\s*\$\$/g, (match, text, id) => {
      const latex = match.slice(2, -2).trim()
      try {
        return katex.renderToString(latex)
      } catch (e) {
        return match
      }
    })
  }
  markup() {
    let markdown = this.katexParser(this.props.markdown)
    return { __html: marked(markdown) }
  }
  componentDidMount() {
    this.span()
  }
  componentDidUpdate() {
    this.debouncedSpan()
  }
  render() {
    const markup = this.markup()
    return (
      <div dangerouslySetInnerHTML={markup} />
    )
  }
}

