
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
import OpenNotes from './components/opennotes.js';
import _ from 'underscore';

// Array.from(this.state.array);
// Object.create(this.state.object);
// Object.assign({}, this.state.object); // merge objects together in one object

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			loggedIn: false,
			user: null,
			userId: '',
			firstTimeUser: true
		}
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}
	login() {
		auth.signInWithPopup(provider)
			.then((result) => {
				const user = result.user;
				const userId = user.uid;
				this.setState({
					user,
					loggedIn: true,
					userId
				}, () => {
					const usersRef = firebase.database().ref(`/users/`);
					usersRef.once('value', (snapshot) => {
						const userList = snapshot.val();

						if (userList === null) {
							usersRef.push({
								name: this.state.user.displayName,
								id: this.state.user.uid
							});
						} else {
							console.log(userList);
							const userIds = _.pluck(userList, 'id');

							if (userIds.includes(this.state.user.uid)) {
								console.log('user already signed in before')
							} else {
								this.newUser();
								const usersListRef = firebase.database().ref(`/users/`);
								usersListRef.push({
									name: this.state.user.displayName,
									id: this.state.user.uid
								});
							}
						}
					});
				})
			});
	}
	newUser() {
		alert('hi whats up');
	}
	logout() {
		auth.signOut()
			.then(() => {
				this.setState({
					user: null,
					loggedIn: false
				})
			});
	}
	render() {
		const showHome = () => {
			if (this.state.loggedIn) {
				return (
					<div>
						<header>
							<h1>Happiness Jar</h1>
							<Link to="/">
								<button onClick={this.logout}>Log Out</button>
							</Link>
						</header>
						<main>
							<Link to={`/writeNote/${this.state.userId}`}>
								<button>Write a Happy Note</button>
							</Link>
							<Link to={`/openNotes/${this.state.userId}`}>
								<button>See Happy Notes</button>
							</Link>
							<Link to={`/${this.state.userId}`}>
								<button>Home</button>
							</Link>
							<Route 
								path="/writeNote/:userId" 
								component={HappyNote} />
							<Route 
								path="/openNotes/:userId" 
								component={OpenNotes} />
							<Route 
								path="/:userId"/>
						</main>
					</div>
				)
			} else {
				return (
					<header>
						<h1>Welcome to Happiness Jar</h1>
						<p>Please log in</p>
						<button onClick={this.login}>Log In</button>
					</header>

					
				)
			} 
		}
		return (
			<Router>
				<div>
					{showHome()}
					<Route 
						path="/"/>
				</div>
			</Router>
		)
	}
	componentDidMount() {
		auth.onAuthStateChanged((user) => {
			if (user) {
				this.setState({
					user,
					loggedIn: true
				});
			} 
		});
	}
}

// need to pass in user id as a props.match.params.userid to the other componenets


ReactDOM.render(<App />, document.getElementById('app'));
