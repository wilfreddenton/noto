import React, { PropTypes, Component } from 'react'
import { findDOMNode } from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  notoWriteAction,
  notoRawAction,
  notoCreateAction,
  notoDeleteAction,
  notoSelectAction,
  notoBlocksAction,
  notoJoinAction } from '../actions/noto'
import { fetchPostAction } from '../actions/posts'
import marked from 'marked'
import _ from 'lodash'
import TWEEN from 'tween.js'
import MDPreview from './MDPreview'
import NotoBlock from './NotoBlock'
import CSSModules from 'react-css-modules'
import styles from '../styles/noto.scss'

@connect(state => ({
  post: state.post,
  selectedBlock: state.notoEditor.selectedID,
  cursorPos: state.notoEditor.cursorPos,
  blocks: state.notoBlocks,
  raw: state.notoRaw
}))
@CSSModules(styles)
export default class NotoEditor extends Component {
  static propTypes = {
    post: PropTypes.object,
    unique: PropTypes.string,
    blocks: PropTypes.array,
    dispatch: PropTypes.func,
    selectedBlock: PropTypes.number,
    raw: PropTypes.string,
    cursorPos: PropTypes.number,
    closing: PropTypes.bool
  }
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.blockTextUpdate = this.blockTextUpdate.bind(this)
    this.animate = this.animate.bind(this)
    this.openAnimation = this.openAnimation.bind(this)
    this.closeAnimation = this.closeAnimation.bind(this)
    this.pasteHandler = this.pasteHandler.bind(this)
    this.generateBlocks = this.generateBlocks.bind(this)
    this.saveRaw = _.debounce(this.saveRaw.bind(this), 1000)
  }
  animate() {
    requestAnimationFrame(this.animate)
    TWEEN.update()
  }
  openAnimation() {
    let ele = findDOMNode(this)
    let size = { height: 0, opacity: 0 }
    let tween = new TWEEN.Tween(size)
      .to({ height: ele.clientHeight, opacity: 1 }, 300)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onStart(function() {
        ele.style.height = size.height.toString + 'px'
        ele.style.opacity = size.opacity
        ele.style.position = 'relative'
      })
      .onUpdate(function() {
        ele.style.height = this.height.toString() + 'px'
        ele.style.opacity = this.opacity
      })
      .onComplete(function() {
        ele.style.height = 'auto'
        ele.style.opacity = 1
        ele.style.paddingBottom = '30px'
      })
      .start()
    this.animate()
  }
  closeAnimation() {
    let ele = findDOMNode(this)
    let size = { height: ele.clientHeight, opacity: 1 }
    let tween = new TWEEN.Tween(size)
      .to({ height: 0, opacity: 0 }, 300)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onStart(function() {
        ele.style.height = size.height.toString() + 'px'
        ele.style.opacity = size.opacity
      })
      .onUpdate(function() {
        ele.style.height = this.height.toString() + 'px'
        ele.style.opacity = this.opacity
      })
      .onComplete(function() {
        ele.style.height = '0px'
        ele.style.opacity = 0
        ele.style.paddingBottom = '0px'
      })
      .start()
    this.animate()
  }
  blockTextUpdate(id, text) {
    const dispatch = this.props.dispatch
    dispatch(notoWriteAction(id, text))
    this.saveRaw() // debounced in constructor
    if (/.*\n\n$/.test(text)) dispatch(notoCreateAction(id))
  }
  saveRaw() {
    let raw = ''
    this.props.blocks.forEach((block, i) => {
      let text = block.text.trim()
      if (i !== this.props.blocks.length - 1)
        text += '\n\n'
      raw += text
    })
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
    let raw = ''
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
  componentWillMount() {
    this.props.dispatch(fetchPostAction(this.props.unique))
  }
  componentWillUpdate(nextProps) {
    if (nextProps.unique !== this.props.unique) {
      this.props.dispatch(fetchPostAction(nextProps.unique))
    }
    if (typeof nextProps.post === 'object' && (_.isEmpty(this.props.post) || this.props.post.unique !== nextProps.post.unique)) {
      const blocks = this.generateBlocks(nextProps.post.content)
      this.props.dispatch(notoBlocksAction(blocks))
      this.props.dispatch(notoSelectAction(blocks.length - 1))
    }
    if (nextProps.closing) {
      this.closeAnimation()
    }
  }
  componentDidMount() {
    this.openAnimation()
  }
  render() {
    const blocks = this.props.blocks.map((block, i) => {
      let selected = (i === this.props.selectedBlock) ? true : false
      return (<NotoBlock key={i} id={i} selected={selected} text={block.text}
        changeHandler={this.blockTextUpdate}
        pasteHandler={this.pasteHandler}
        cursorPos={this.props.cursorPos}
        { ...bindActionCreators({ notoDeleteAction, notoSelectAction, notoCreateAction, notoWriteAction, notoJoinAction }, this.props.dispatch)} />)
    })
    //<MDPreview markdown={this.props.raw} />
    return (
      <div id="noto-editor" ref="editor" styleName="noto-editor">
        {blocks}
      </div>
    )
  }
}

