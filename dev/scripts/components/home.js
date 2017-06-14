import React from 'react';
import firebase, { auth, database, provider, dbRef } from '../firebase.js';
import Instructions from './instructions.js';

export default class Home extends React.Component {
	constructor() {
		super();
		this.state = {
		}
	}
	render() {
		return (
			<div className="userProfile">
				<div className="userHeader">
					<h2>Welcome, {this.props.user.displayName}</h2>
					<img className="userImage" src={this.props.user.photoURL} alt=""/>
				</div>
				<div>
					{/*Want the user to see if they have filled out their notes for the day, then if its the end of the week they can open their jar*/}
				</div>
					{this.props.firstTime && !this.props.finished ?
						<div className="instructions">
							<Instructions finish={this.props.finishInstructions}/>
						</div> : null
					}
			</div>

		)
	}
}
