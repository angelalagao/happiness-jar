
// Home page should have a login button 
// First user view will have an instructions modal view pop up including the following:
// If user already has an account and logs in it will directly take them to the home page
// On the home page:
// Create two buttons or links in the App component that will send the user to "Write a note" view and "View Notes" view
// Write a note view should have a form including title, textarea, upload image option,
// Once form is submitted, user should be able to see a preview of their note with the value of title, image and message on the same view.
// Confirmation that note was entered and data was stored in firebase
// The "View Notes" view should contain the individual notes the user submitted

// Get the users date and tracking it so that by the end of the week, the user can get a 'final review' of all of the happy notes they submitted

import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	NavLink as Link,
	Route,
	Redirect
} from 'react-router-dom';
// Set up firebase database
import firebase, { auth, database, provider, dbRef } from './firebase.js';
import HappyNote from './components/happynote.js';
import OpenNotes from './components/opennotes.js';
import Favourites from './components/favourites.js';
import Instructions from './components/instructions.js';
import Home from './components/home.js'
import _ from 'underscore';
import Time from 'react-time';

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
			firstTimeUser: false,
			finished: false
		}
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.finishInstructions = this.finishInstructions.bind(this);
	}
	finishInstructions() {
		this.setState({
			finished: true,
			firstTimeUser: false
		});
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
				});
			});
	}
	logout() {
		auth.signOut()
			.then(() => {
				this.setState({
					user: null,
					loggedIn: false
				})
				window.location.pathname = '/';
			});
	}
	render() {
		let now = new Date();
		const showHome = () => {
			if (this.state.loggedIn) {
				return (
					<div className="wrapper">
						<header className="loggedInHeader">
							<Link to={`/${this.state.userId}`}>
								<h1><span className="happiness">Happiness</span> Jar</h1>
							</Link>
							<div className="loggedInHeader__nav">
								<p><Time value={now} format="MM/DD/YYYY"/></p>
								<Link to={`/${this.state.userId}`}>
									<img src={this.state.user.photoURL} alt=""/>
								</Link>
								<Link to="/" onClick={this.logout}>
									<div className="logout">
										<p>Log Out</p>
									</div>
								</Link>
							</div>
						</header>
						<main>
							<Route 
							exact path="/:userId" 
							render= {() => 
								<Home 
									finishInstructions={this.finishInstructions} 
									user={this.state.user} 
									finished={this.state.finished} 
									firstTime={this.state.firstTimeUser} 
								/>} 
							/>
							<div className="optionsNav">
								<Link to={`/writeNote/${this.state.userId}`}>
									<div className="nav__links">
										<i className="fa fa-pencil" aria-hidden="true"></i>
										<p>Write a Happy Note</p>
									</div>
								</Link>
								<Link to={`/openNotes/${this.state.userId}`}>
									<div className="nav__links">
										<i className="fa fa-unlock-alt" aria-hidden="true"></i>
										<p>Open Happiness Jar</p>
									</div>
								</Link>
								<Link to={`/favourites/${this.state.userId}`}>
									<div className="nav__links">
										<i className="fa fa-thumb-tack" aria-hidden="true"></i>
										<p>Pinned Happy Notes</p>
									</div>
								</Link>
							</div>
							<Route exact path="/" 
								render={ () => (
									this.state.loggedIn ? 
									<Redirect to={`/${this.state.userId}`} /> : 
									<Redirect to='/' />
								)
								} />
							<Route 
								path="/writeNote/:userId" 
								component={HappyNote} />
							<Route 
								path="/openNotes/:userId" 
								component={OpenNotes} />
							<Route 
								path="/favourites/:userId" 
								component={Favourites} />
						</main>
					</div>
				)
			} else {
				return (
					<header className="loginHome">
						<h1>Welcome to Happiness Jar</h1>
						<p className="loginHome__text">Write down something that made you happy</p>
						<div className="loginHome__login">
							<p className="loginHome__text">Please log in using Google</p>
							<button
								className="loginHome__button" 
								onClick={this.login}>
								Log In
							</button>
						</div>
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
					userId: user.uid,
					loggedIn: true
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
							const userIds = _.pluck(userList, 'id');

							if (userIds.includes(this.state.user.uid)) {
								this.setState({
									firstTimeUser: false
								});
							} else {
								this.setState({
									firstTimeUser: true
								});
								const usersListRef = firebase.database().ref(`/users/`);
								usersListRef.push({
									name: this.state.user.displayName,
									id: this.state.user.uid
								});
							}
						}
					});
				});
			} 
		});
	}
}

// need to pass in user id as a props.match.params.userid to the other componenets


ReactDOM.render(<App />, document.getElementById('app'));
