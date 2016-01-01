import React, { PropTypes, Component } from 'react'
import { findDOMNode } from 'react-dom'
import _ from 'lodash'
import autosize from 'autosize'
import MDPreview from './MDPreview'
import CSSModules from 'react-css-modules'
import styles from '../styles/noto.scss'

@CSSModules(styles)
export default class NotoBlock extends Component {
  static propTypes = {
    changeHandler: PropTypes.func,
    pasteHandler: PropTypes.func,
    notoDeleteAction: PropTypes.func,
    notoSelectAction: PropTypes.func,
    id: PropTypes.number,
    selected: PropTypes.bool,
    text: PropTypes.string
  }
  constructor(props) {
    super(props)
    this.span = this.span.bind(this)
    this.debouncedSpan = _.debounce(this.span, 1000)
    this.changeHandler = this.changeHandler.bind(this)
    this.keydownHandler = this.keydownHandler.bind(this)
    this.keyupHandler = this.keyupHandler.bind(this)
    this.deleteHandler = this.deleteHandler.bind(this)
    this.updownHandler = this.updownHandler.bind(this)
    this.prepareEditor = this.prepareEditor.bind(this)
    this.clickHandler = this.clickHandler.bind(this)
    this.pasteHandler = this.pasteHandler.bind(this)
    this.cursorClickHandler = this.cursorClickHandler.bind(this)
  }
  prepareEditor() {
    let editor = this.refs.editor
    autosize(editor)
    editor.addEventListener('paste', this.pasteHandler)
    editor.addEventListener('keydown', this.keydownHandler)
    editor.addEventListener('keyup', this.keyupHandler)
    editor.focus()
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
    setTimeout(() => {
      let editor = this.refs.editor
      if (Math.abs(eventLeft - childLeft) <= Math.abs(eventLeft - childRight)) {
        editor.selectionStart = editor.selectionEnd = i
      } else {
        editor.selectionStart = editor.selectionEnd = i + 1
      }
      editor.focus()
    }, 100)
  }
  span(ele) {
    // traverse dom and replace textContent with character span wrapped version
    let node = ele ? ele : findDOMNode(this.refs.preview)
    _.forEach(node.children, (child, i) => {
      let docFrag = document.createDocumentFragment()
      if (child.className.indexOf('katex') > -1) {
        console.log('hey')
        return
      }
      if (!/<([a-zA-Z]*)\b[^>]*>([^]*?)<\/\1>/.test(child.innerHTML)) {
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
        this.span(child)
      }
    })
    return
  }
  changeHandler(e) {
    this.debouncedSpan()
    this.props.changeHandler(this.props.id, this.refs.editor.value)
  }
  keydownHandler(e) {
    const key = e.keyCode || e.charCode
    switch (key) {
      case 8:
        this.deleteHandler(e)
        break
    }
  }
  keyupHandler(e) {
    const key = e.keyCode || e.charCode
    switch (key) {
      case 38:
      case 40:
        this.updownHandler(e, key)
        break
    }
  }
  deleteHandler(e) {
    if (this.refs.editor.selectionStart === 0 && this.props.text !== '') {
      e.preventDefault()
      this.props.notoSelectAction(this.props.id - 1)
      return false
    } else if (this.props.text === '') {
      e.preventDefault()
      this.props.notoDeleteAction(this.props.id)
      return false
    }
  }
  updownHandler(e, key) {
    const editor = this.refs.editor
    if (key === 38 && editor.selectionStart === 0) { // up
      this.props.notoSelectAction(this.props.id - 1)
    } else if (key === 40 && editor.selectionStart === editor.value.length) { // down
      this.props.notoSelectAction(this.props.id + 1)
    }
  }
  clickHandler(e) {
    if (!this.props.selected)
      this.props.notoSelectAction(this.props.id)
  }
  pasteHandler(e) {
    setTimeout(() => {
      const toID = this.props.id + this.props.text.split('\n\n').length - 1
      this.props.pasteHandler(this.props.id, toID)
    }, 100)
  }
  componentDidMount() {
    this.span()
    if (this.props.selected) {
      this.prepareEditor()
    }
  }
  componentDidUpdate() {
    if (this.props.selected) {
      let editor = this.refs.editor
      this.prepareEditor()
      if (/.*\n\n$/.test(this.refs.editor.value)) {
        editor.value = editor.value.slice(0, -1)
      }
    }
  }
  componentWillUnmount() {
    if (this.props.selected) {
      this.refs.editor.removeEventListener('keydown', this.deleteHandler)
      this.refs.editor.removeEventListener('keyup', this.keyupHandler)
      this.refs.editor.removeEventListener('paste', this.pasteHandler)
    }
  }
  render() {
    const editor = (this.props.selected
      ? (<div>
           <div styleName="markdown-symbol"></div>
           <textarea ref="editor" styleName="noto-editor" value={this.props.text} onChange={this.changeHandler} />
         </div>)
      : null)
    return (
      <div onClick={this.clickHandler} >
        <MDPreview ref="preview" markdown={this.props.text} />
        {editor}
      </div>
    )
  }
}
