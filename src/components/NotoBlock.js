import React, { PropTypes, Component } from 'react'
import _ from 'lodash'
import MDPreview from './MDPreview'

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
    this.changeHandler = this.changeHandler.bind(this)
    this.deleteHandler = this.deleteHandler.bind(this)
    this.prepareEditor = this.prepareEditor.bind(this)
    this.clickHandler = this.clickHandler.bind(this)
    this.pasteHandler = this.pasteHandler.bind(this)
  }
  prepareEditor() {
    let editor = this.refs.editor
    editor.addEventListener('paste', this.pasteHandler)
    editor.addEventListener('keydown', this.deleteHandler)
    editor.focus()
    editor.selectionStart = editor.selectionEnd = editor.value.length
  }
  changeHandler(e) {
    this.props.changeHandler(this.props.id, this.refs.editor.value)
  }
  deleteHandler(e) {
    if (this.props.text === '') {
      var key = event.keyCode || event.charCode
      if (key === 8) {
        e.preventDefault()
        this.props.notoDeleteAction(this.props.id)
        return false
      }
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
    if (this.props.selected)
      this.refs.editor.removeEventListener('keydown', this.deleteHandler)
  }
  render() {
    const editor = (this.props.selected
      ? <textarea ref="editor" value={this.props.text} onChange={this.changeHandler} />
      : null)
    return (
      <div onClick={this.clickHandler} >
        <MDPreview markdown={this.props.text} />
        {editor}
      </div>
    )
  }
}
