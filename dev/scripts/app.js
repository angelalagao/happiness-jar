
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

class HappyNote extends React.Component {
	constructor() {
		super();
		this.state = {
			currentTitle: '',
			currentImage: '',
			currentHappyNote: '',
			happyNotes: []
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.uploadPhoto = this.uploadPhoto.bind(this);
	}
	uploadPhoto(e) {
		let file = e.target.files[0];
		console.log(file.name);
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	handleSubmit(e) {
		e.preventDefault();
		dbRef.push({
			title: this.state.currentTitle,
			image: this.state.currentImage,
			happyNote: this.state.currentHappyNote,
			date: new Date()
		});
	}
	render() {
		return (
			<div>
				<h2>Write your note here</h2>
				<form action="" onSubmit={this.handleSubmit}>
					<input onChange={this.handleChange} name="currentTitle" value={this.state.currentTitle} type="text" placeholder="Title"/>
					<input onChange={this.uploadPhoto} type="file" name="currentImage" accept="image/*" />
					<textarea onChange={this.handleChange} name="currentHappyNote" value={this.state.currentHappyNote} rows="10" cols="50" placeholder="Enter your happy note here"> </textarea>
					<input type="submit" value="Post Happy Note :D" />
				</form>
				<div>
					<h1>{this.state.currentTitle}</h1>
					<img src={this.state.currentImage} alt=""/>
					<p>{this.state.currentHappyNote}</p>
				</div>
			</div>
			
		)
	}
	componentDidMount() {
		dbRef.on('value', (snapshot) => {
			const dbHappyNote = snapshot.val();
			const newHappyNotes = [];
			for (let key in dbHappyNote) {
				newHappyNotes.push({
					key,
					currentTitle: '',
					currentImage: '',
					currentHappyNote: '',
				})
			}
		})
	}
}

class OpenNotes extends React.Component {
	constructor() {
		super();
		this.state = {
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
