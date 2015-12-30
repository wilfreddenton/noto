import React, { PropTypes, Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  notoWriteAction,
  notoRawAction,
  notoCreateAction,
  notoDeleteAction,
  notoSelectAction,
  notoBlocksAction } from '../actions/noto'
import marked from 'marked'
import _ from 'lodash'
import MDPreview from './MDPreview'
import NotoBlock from './NotoBlock'
import CSSModules from 'react-css-modules'
import styles from '../styles/noto.scss'

@CSSModules(styles)
@connect(state => ({
  selectedBlock: state.notoEditor,
  blocks: state.notoBlocks,
  raw: state.notoRaw
}))
export default class Noto extends Component {
  static propTypes = {
    blocks: PropTypes.array
  }
  constructor(props) {
    super(props)
    this.blockTextUpdate = this.blockTextUpdate.bind(this)
    this.pasteHandler = this.pasteHandler.bind(this)
    this.generateBlocks = this.generateBlocks.bind(this)
    this.saveRaw = _.debounce(this.saveRaw.bind(this), 1000)
  }
  blockTextUpdate(id, text) {
    const dispatch = this.props.dispatch
    dispatch(notoWriteAction(id, text))
    this.saveRaw() // debounced in constructor
    if (/.*\n\n$/.test(text)) dispatch(notoCreateAction(id))
  }
  saveRaw() {
    let raw = ""
    this.props.blocks.forEach((block) => raw += block.text)
    this.props.dispatch(notoRawAction(raw))
  }
  generateBlocks(raw) {
    let parsedRaw = raw ? raw.split('\n\n') : this.props.raw.split('\n\n')
    let blocks = []
    parsedRaw.forEach((text, i) => {
      if (i !== parsedRaw.length - 1)
        text += '\n\n'
      if (text) blocks.push({ text: text })
    })
    return blocks
  }
  pasteHandler(id, toID) {
    let raw = ""
    this.props.blocks.forEach((block, i) => {
      let text = block.text
      if (id === i) {
        text = text.trim()
        if (id !== this.props.blocks.length - 1) text += '\n\n'
      }
      raw += text
    })
    const blocks = this.generateBlocks(raw)
    this.props.dispatch(notoRawAction(raw))
    this.props.dispatch(notoBlocksAction(blocks))
    this.props.dispatch(notoSelectAction(toID))
  }
  componentDidMount() {
    const blocks = this.generateBlocks()
    this.props.dispatch(notoBlocksAction(blocks))
    this.props.dispatch(notoSelectAction(blocks.length - 1))
  }
  render() {
    const blocks = this.props.blocks.map((block, i) => {
      let selected = (i === this.props.selectedBlock) ? true : false
      return <NotoBlock key={i} id={i} selected={selected} text={block.text}
        changeHandler={this.blockTextUpdate}
        pasteHandler={this.pasteHandler}
        { ...bindActionCreators({ notoDeleteAction, notoSelectAction }, this.props.dispatch)} />
    })
    //<MDPreview markdown={this.props.raw} />
    return (
      <div>
        {blocks}
      </div>
    )
  }
}
