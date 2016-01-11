import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'

export default class Test extends Component {
	static propTypes = {}
	render() {
		return (
			<div data-component="test">
				<p>testing</p>
        <Link to="/posts">posts</Link>
			</div>
		)
	}
}
