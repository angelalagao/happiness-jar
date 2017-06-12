import React from 'react';
import {
	BrowserRouter as Router,
	NavLink as Link,
	Route
} from 'react-router-dom';
// import firebase, { auth, database, provider, dbRef } from '../firebase.js';

export default class Instructions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentStep: 0,
			instructions: [
			{
				step: 1,
				content: `Write out as many happy notes as you want for each day 😃`
			},
			{
				step: 2,
				content: `View your happy notes anytime you're feeling sad 😔`
			},
			{
				step: 3,
				content: `Go and be happy! 😄`
			}
			]
		}
		this.changeStep = this.changeStep.bind(this);
	}
	changeStep() {
		this.setState({
			currentStep: this.state.currentStep + 1
		});
	}
	render() {
		return (
			<Router>
				<div>
					<h2>How to get started:</h2>
					<Instruction 
						step={this.state.instructions[this.state.currentStep].step} 
						content={this.state.instructions[this.state.currentStep].content} />
					{this.state.currentStep === this.state.instructions.length - 1 ? 
					<button onClick={this.props.finish}>Get Started</button> :
					<button onClick={this.changeStep}>Next</button>}
				</div>
			</Router>
		)
	}
}

const Instruction = (props) => {
	return (
		<div>
			<h3>Step {props.step}:</h3>
			<p>{props.content}</p>
		</div>
	)
}