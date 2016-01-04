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
    notoCreateAction: PropTypes.func,
    notoDeleteAction: PropTypes.func,
    notoSelectAction: PropTypes.func,
    notoWriteAction: PropTypes.func,
    notoJoinAction: PropTypes.func,
    id: PropTypes.number,
    selected: PropTypes.bool,
    text: PropTypes.string,
    cusorPos: PropTypes.number
  }
  constructor(props) {
    super(props)
    this.state = {
      justSelected: false
    }
    this.changeHandler = this.changeHandler.bind(this)
    this.keydownHandler = this.keydownHandler.bind(this)
    this.keyupHandler = this.keyupHandler.bind(this)
    this.deleteHandler = this.deleteHandler.bind(this)
    this.updownHandler = this.updownHandler.bind(this)
    this.prepareEditor = this.prepareEditor.bind(this)
    this.clickHandler = this.clickHandler.bind(this)
    this.pasteHandler = this.pasteHandler.bind(this)
    this.cursorClickHandler = this.cursorClickHandler.bind(this)
    this.fixInput = this.fixInput.bind(this)
    this.debouncedFixInput = _.debounce(this.fixInput, 1000)
    this.setCursor = this.setCursor.bind(this)
  }
  setCursor(i, time = 0) {
    let editor = this.refs.editor
    setTimeout(() => {
      editor.selectionStart = editor.selectionEnd = i
    }, time)
  }
  prepareEditor() {
    let editor = this.refs.editor
    autosize(editor)
    editor.addEventListener('paste', this.pasteHandler)
    editor.addEventListener('keydown', this.keydownHandler)
    editor.addEventListener('keyup', this.keyupHandler)
    editor.focus()
    if (this.props.cursorPos === -0.5) {
      this.setCursor(this.props.text.length)
    } else if (this.props.cursorPos < -0.5) {
      this.setCursor(this.props.text.length + this.props.cursorPos)
    } else {
      this.setCursor(this.props.cursorPos)
    }
  }
  cursorClickHandler(i) {
    setTimeout(() => {
      let editor = this.refs.editor
      this.setCursor(i)
      editor.focus()
    }, 100)
  }
  fixInput() {
    let editor = this.refs.editor
    let text = editor.value
    text = text.replace(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\)/g, (match, text, id) => {
      return match.slice(0, -1) + '/' + match.slice(-1)
    })
    const diff = text.length - editor.value.length
    let selectionStart = editor.selectionStart
    this.props.changeHandler(this.props.id, text)
    this.setCursor(selectionStart + diff)
  }
  changeHandler(e) {
    this.props.changeHandler(this.props.id, this.refs.editor.value)
  }
  keydownHandler(e) {
    const key = e.keyCode || e.charCode
    switch (key) {
      case 8:
        this.deleteHandler(e)
        break
      case 38:
      case 40:
        this.updownHandler(e, key)
        break
    }
  }
  keyupHandler(e) {
    const key = e.keyCode || e.charCode
    switch (key) {
    }
  }
  deleteHandler(e) {
    const editor = this.refs.editor
    if (editor.selectionStart === 0 && editor.selectionEnd === 0 && this.props.text !== '') {
      e.preventDefault()
      if (this.props.id !== 0) {
        const length = this.props.text.length
        this.props.notoJoinAction(this.props.id, this.props.id - 1, this.props.text)
        this.props.notoSelectAction(this.props.id - 1, -length)
      }
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
      this.props.notoSelectAction(this.props.id + 1, 0)
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
    if (this.props.selected) {
      this.prepareEditor()
    }
  }
  componentWillUpdate(nextProps) {
    if (!this.props.selected && nextProps.selected)
      this.setState({ justSelected: true })
  }
  componentDidUpdate() {
    if (this.props.selected) {
      let editor = this.refs.editor
      if (this.state.justSelected) {
        this.prepareEditor()
        this.setState({ justSelected: false })
      }
      if (/.*\n\n$/.test(editor.value)) {
        editor.value = editor.value.slice(0, -1)
      } else if (/^((?!```)[^>])*\n\n.*/.test(editor.value)) {
        console.log(editor.value.match(/.*\n\n.*/))
        const blocks = editor.value.split('\n\n')
        this.props.notoWriteAction(this.props.id, blocks[0] + '\n\n')
        this.props.notoCreateAction(this.props.id, this.props.id + 1, blocks[1])
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
    const editor = this.props.selected ? (
      <div>
        <div styleName="markdown-symbol"></div>
        <textarea ref="editor" styleName="noto-editor" value={this.props.text} onChange={this.changeHandler} />
      </div>
    ) : null
    return (
      <div onClick={this.clickHandler} >
        <MDPreview ref="preview" markdown={this.props.text} cursorClickHandler={this.cursorClickHandler} />
        {editor}
      </div>
    )
  }
}
