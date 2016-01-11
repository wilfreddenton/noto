import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import CSSModules from 'react-css-modules'
import ReactTransitionGroup from 'react-addons-transition-group'
import styles from '../styles/noto.scss'
import NotoEditor from './NotoEditor'

@connect(state => ({ selectedPostUnique: state.post.unique }))
@CSSModules(styles, { allowMultiple: true })
export default class NotoPostListItem extends Component {
  static propTypes = {
    index: PropTypes.number,
    post: PropTypes.object,
    selected: PropTypes.bool,
    history: PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = {
      scrolled: false,
      closing: false
    }
    this.clickHandler = this.clickHandler.bind(this)
    this.scrollHandler = this.scrollHandler.bind(this)
  }
  clickHandler(e) {
    let path = this.props.selected ?
      '/posts' : `/posts/${this.props.post.unique}/edit`
    if (path === '/posts') {
      this.setState({ closing: true })
      setTimeout(() => {
        this.props.history.pushState(null, path)
        this.setState({ closing: false })
      }, 310)
    } else {
      this.props.history.pushState(null, path)
    }
  }
  scrollHandler(e) {
    let node = findDOMNode(this)
    if ((node.offsetTop <= window.scrollY) && this.props.selected && !this.state.scrolled) {
      this.setState({ scrolled: true })
    } else if ((node.offsetTop > window.scrollY) && this.props.selected && this.state.scrolled) {
      this.setState({ scrolled: false })
    }
  }
  componentWillUpdate(nextProps) {
    if (!nextProps.selected && this.props.selected)
      this.setState({ scrolled: false })
  }
  componentDidMount() {
    window.addEventListener('scroll', this.scrollHandler)
  }
  render() {
    let placeholder = this.state.scrolled ? 'block' : 'none'
    let styleName = this.state.scrolled ? 'noto-post-list-item fixed' : 'noto-post-list-item'
    return (
      <div>
        <div style={{ display: placeholder }} styleName="noto-post-list-item-placeholder"></div>
        <div styleName={styleName} onClick={this.clickHandler}>
          <h3>{this.props.post.title}:</h3><h4>{this.props.post.subtitle}</h4>
        </div>
        {this.props.selected ? <NotoEditor unique={this.props.post.unique} closing={this.state.closing} /> : null }
      </div>
    )
  }
}
