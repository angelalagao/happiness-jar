
// Home page should have a login button and create account button
// Login will lead to a view where user can enter their email and password if already an existing user
// Create account will lead to view where user can input email, password and confirm password
// First user view will have an instructions slider view pop up including the following:
// Step 1: Write out as many happy notes as you want for the day! with 'next' button that will take the user to the next step
// Step 2: View your happy notes anytime you're feeling sad :( with 'next' button that will take the user to the next step
// Step 3: Go and be happy! with 'get started' button that will take you to the home page
// If user already has an account and logs in it will directly take them to the home page
// On the home page:
// Create two buttons or links in the App component that will send the user to "Write a note" view and "View Notes" view
// 

import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	NavLink as Link,
	Route
} from 'react-router-dom';
// Set up firebase database
import firebase, { auth, database, provider, dbRef } from './firebase.js';

class HappyNote extends React.Component {
	render() {
		return (
			<div>
				<h2>Write your note here</h2>
				<form action="">
					<input type="text" placeholder="Title"/>
					<textarea name="happyNote" rows="10" cols="50"> </textarea>
					<input type="submit" value="Post Happy Note :D" />
				</form>
			</div>
			
		)
	}
}

class OpenNotes extends React.Component {
	constructor() {
		super();
		this.state = {
			currentTitle: '',
			currentHappyNote: '',
			happyNotes: []
		}
	}
	render() {
		return (
			<div>
				<h2>Your Notes</h2>
				<ul>
					<li>Notes go here</li>
				</ul>
			</div>
		)
	}
}

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			currentTitle: '',
			currentHappyNote: '',
			happyNotes: [],
			loggedIn: false,
			user: null
		}
	}
	render() {
		return (
			<Router>
				<div>
					<header>
						<h1>Happiness Jar</h1>
						<button>Log In</button>
						<button>Log Out</button>
					</header>
					<main>
						<Link to="/writeNote"><button>Write a Happy Note</button></Link>
						<Link to="/openNotes"><button>See Happy Notes</button></Link>
						<Route path="/writeNote" component={HappyNote}/>
						<Route path="/openNotes" component={OpenNotes}/>
					</main>
				</div>
			</Router>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
