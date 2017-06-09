
// Home page should have a login button 
	// Login will lead to a view where user can enter their email and password if already an existing user
	// Create account will lead to view where user can input email, password and confirm password
// First user view will have an instructions slider view pop up including the following:
// Step 1: Write out as many happy notes as you want for the day! with 'next' button that will take the user to the next step
// Step 2: View your happy notes anytime you're feeling sad :( with 'next' button that will take the user to the next step
// Step 3: Go and be happy! with 'get started' button that will take you to the home page
// If user already has an account and logs in it will directly take them to the home page
// On the home page:
// Create two buttons or links in the App component that will send the user to "Write a note" view and "View Notes" view
// Write a note view should have a form including title, textarea, upload image option,
// Once form is submitted, user should be able to see a preview of their note with the value of title, image and message on the same view.
// Confirmation that note was entered and data was stored in firebase
// The "View Notes" view should contain the individual notes the user submitted

// How to get the users date and tracking it so that by the end of the week, the user can get a 'final review' of all of the happy notes they submitted

import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	NavLink as Link,
	Route
} from 'react-router-dom';
// Set up firebase database
import firebase, { auth, database, provider, dbRef } from './firebase.js';
import HappyNote from './components/happynote.js';



// Array.from(this.state.array);
// Object.create(this.state.object);
// Object.assign({}, this.state.object); // merge objects together in one object

class OpenNotes extends React.Component {
	constructor() {
		super();
		this.state = {
			happyNotes: []
		}
	}
	componentDidMount() {
		dbRef.on('value', (snapshot) => {
			const dbHappyNote = snapshot.val();
			const newHappyNotes = [];
			console.log(dbHappyNote);
			for (let key in dbHappyNote) {
				newHappyNotes.push({
					key,
					currentTitle: dbHappyNote[key].title,
					currentHappyNote: dbHappyNote[key].happyNote,
					currentDate: dbHappyNote[key].date,
					currentImage: dbHappyNote[key].image
				})
			}
			console.log(newHappyNotes);
			this.setState({
				happyNotes: newHappyNotes
			});
			console.log(this.state.happyNotes);
		})
	}
	componentWillUnmount() {
		dbRef.off('value');
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
