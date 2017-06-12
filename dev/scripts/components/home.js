import React from 'react';
import firebase, { auth, database, provider, dbRef } from '../firebase.js';
import Instructions from './instructions.js';

export default class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			finished: false
		}
		this.finishInstructions = this.finishInstructions.bind(this);
	}
	finishInstructions() {
		this.setState({
			finished: true
		});
	}
	render() {
		return (
			<div>
				<h2>Welcome {this.props.user.displayName}</h2>
				<img src={this.props.user.photoURL} alt=""/>
				{this.props.firstTime && !this.state.finished ?
					<Instructions finish={this.finishInstructions}/> : null
				}

			</div>
		)
	}
}
