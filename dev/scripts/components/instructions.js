import React from 'react';
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
			<div className="instruction">
				<h2>How to Get Started:</h2>
				<Instruction 
					step={this.state.instructions[this.state.currentStep].step} 
					content={this.state.instructions[this.state.currentStep].content} />
				{this.state.currentStep === this.state.instructions.length - 1 ? 
				<button onClick={this.props.finish}>
					<i className="fa fa-check" aria-hidden="true"></i>
				</button> :
				<button onClick={this.changeStep}>
					<i className="fa fa-step-forward" aria-hidden="true"></i>
				</button>}
			</div>
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