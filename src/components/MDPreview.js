import React, { PropTypes, Component } from 'react'
import _ from 'lodash'
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
    this.state = { unmounting: false }
    this.span = this.span.bind(this)
    this.debouncedSpan = _.debounce(this.span, 300)
    this.cursorClickHandler = this.cursorClickHandler.bind(this)
    this.katexParser = this.katexParser.bind(this)
    this.highlightCode = this.highlightCode.bind(this)
  }
  inlineOffsets(child) {
    if (child.tagName === 'EM') {
      return child.children.length + 2
    } else if (child.tagName === 'STRONG') {
      return child.children.length + 4
    } else if (child.tagName === 'A') {
      return child.children.length + child.href.length + 4
    } else if (child.tagName === 'SPAN' && child.className.indexOf('katex') > -1) {
      return child.dataset.raw.length
    } else if (child.tagName === 'CODE') {
      return child.children.length + 2
    } else {
      return 1
    }
  }
  cursorOffset(child) {
    const tagName = child.parentNode.tagName
    const text = this.props.markdown
    const childCopy = child
    let i = 0
    if (/H[1-6]/.test(tagName)) {
      while ((child = child.previousSibling) !== null)
        i += 1
      i += text.match(/#\s+/)[0].length
    } else if (tagName === 'P') {
      while ((child = child.previousSibling) !== null)
        i += this.inlineOffsets(child)
    } else if (tagName === 'EM' || tagName === 'CODE') {
      while ((child = child.previousSibling) !== null)
        i += 1
      child = childCopy
      let parent = child.parentNode
      i += this.cursorOffset(parent)
      i += 1
    } else if (tagName === 'STRONG') {
      while ((child = child.previousSibling) !== null)
        i += 1
      child = childCopy
      let parent = child.parentNode
      i += this.cursorOffset(parent)
      i += 2
    } else if (tagName === 'LI') {
      while ((child = child.previousSibling) !== null)
        i += this.inlineOffsets(child)
      child = childCopy
      let row = 0
      let li = child.parentNode
      const rows = text.split('\n')
      while((li = li.previousSibling) !== null)
        if (li.tagName === 'LI')
          row += 1
      for (let j = 0; j <= row; j += 1) {
        if (j === row) {
          i += rows[j].match(/([0-9]+\.|\-|\+|\*)\s+/)[0].length
        } else {
          i += rows[j].length + 1
        }
      }
    }
    return i
  }
  cursorClickHandler(e) {
    let katex = e.path.filter((ele, i) => {
      return ele.className && /^\s*katex\s*$/.test(ele.className)
    })
    let child = null
    if (katex.length > 0) {
      child = katex[0]
    } else {
      child = e.target
    }
    let i = this.cursorOffset(child)
    const eventLeft = e.clientX
    const childLeft = child.offsetLeft
    const childWidth = child.offsetWidth
    const childRight = childLeft + childWidth
    if (Math.abs(eventLeft - childLeft) > Math.abs(eventLeft - childRight)) {
      i += 1
    }
    this.props.cursorClickHandler(i)
  }
  span(ele) {
    // traverse dom and replace textContent with character span wrapped version
    let node = ele ? ele : findDOMNode(this)
    let children = _.map(node.childNodes, (child) => child)
    _.forEach(children, (child, i) => {
      let docFrag = document.createDocumentFragment()
      if (child.tagName === 'SPAN' && child.className.indexOf('katex') > -1) {
        child.onclick = this.cursorClickHandler
        return
      }
      if (child.tagName === 'CODE' && child.parentNode.tagName === 'PRE') {
        return
      }
      if ((child.className && child.className.indexOf('katex') > -1) || child.tagName === 'SPAN' || child.tagName === 'DIV')
        return
      if (child.nodeName === '#text') {
        const text = child.textContent
        for (let j = 0; j < text.length; j += 1) {
          let span = document.createElement('span')
          span.innerHTML = text.charAt(j)
          span.onclick = this.cursorClickHandler
          docFrag.appendChild(span)
        }
        node.insertBefore(docFrag, child)
        node.removeChild(child)
      } else {
        this.span(child)
      }
    })
    return
  }
  katexParser(string) {
    return string.replace(/\$\$\s*((?!\$\$)[^])*\s*\$\$/g, (match, text, id) => {
      const latex = match.slice(2, -2).trim()
      try {
        let markup = katex.renderToString(latex)
        markup = markup.slice(0, 5) + ' data-raw="' + match + '"' + markup.slice(5)
        return markup
      } catch (e) {
        return match
      }
    })
  }
  highlightCode() {
    let code = findDOMNode(this).querySelector('pre code')
    if (code) {
      if (code.parentNode.className.indexOf('line-numbers') <= -1)
        code.parentNode.className += " line-numbers"
      window.Prism.highlightElement(code)
    }
  }
  markup() {
    let markdown = this.katexParser(this.props.markdown)
    return { __html: marked(markdown) }
  }
  componentDidMount() {
    this.highlightCode()
    this.span()
  }
  componentWillUnmount() {
    this.setState({ unmounting: true })
  }
  componentDidUpdate() {
    if (this.props.markdown.length > 0 && !this.state.unmounting) {
      this.highlightCode()
      this.debouncedSpan()
    }
  }
  render() {
    const markup = this.markup()
    return (
      <div dangerouslySetInnerHTML={markup} />
    )
  }
}

