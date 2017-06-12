import React from 'react';
import firebase, { auth, database, provider, dbRef } from '../firebase.js';
import _ from 'underscore';
import moment from 'moment';
import {
	BrowserRouter as Router,
	NavLink as Link,
	Route
} from 'react-router-dom';
import Favourites from './favourites.js'

// need to sort notes per week
// display on the page in chronological order where a set of notes are displayed for each week
// i.e. show 'recap' of all notes from the week of june 5th-11th etc.

// create another class that will show the individual note and like the note 'add to favorites'

export default class OpenNotes extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			orderedHappyNotes: [],
			favourites: [],
			favouriteKey: ''
		}
		this.addToFavourites = this.addToFavourites.bind(this);
	}
	componentDidMount() {
		const newHappyNotes = [];
		let orderedHappyNotes = [];
		const userRef = firebase.database().ref(this.props.match.params.userId);
		userRef.on('value', (snapshot) => {
			const dbHappyNote = snapshot.val();
			for (let key in dbHappyNote) {
				newHappyNotes.push({
					key,
					currentTitle: dbHappyNote[key].title,
					currentHappyNote: dbHappyNote[key].happyNote,
					currentDate: dbHappyNote[key].date,
					currentImage: dbHappyNote[key].image
				})
			}
			newHappyNotes.map((note) => {
				return note.currentDate = new Date(note.currentDate);
			});
			let orderedNotes = _.groupBy(newHappyNotes, (note) => {
				return moment(note.currentDate, 'DD/MM/YYYY').startOf('isoWeek');
			});
			for (let key in orderedNotes) {
				orderedHappyNotes.push({
					weekOf: key,
					notes: orderedNotes[key]
				})
			}
			this.setState({
				orderedHappyNotes: orderedHappyNotes.reverse()
			});
			window.orderedHappyNotes = this.state.orderedHappyNotes;
		});
	}
	componentWillUnmount() {
		const userRef = firebase.database().ref(this.props.match.params.userId);
		userRef.off('value');
	}
	addToFavourites(e) {
		const favourites = Array.from(this.state.favourites);
		this.state.orderedHappyNotes.map((happyNote) => {
			happyNote.notes.map((note) => {
				if (note.key === e.target.value) {
					favourites.push(note);
					this.setState({
						favouriteKey: note.key,
						favourites
					})
				}
			})
		})
		const userRef = firebase.database().ref(this.props.match.params.userId).child(e.target.value);
		userRef.update({
			favourited: true
		});
	}
	// need to show the user the week of notes they are reviewing
	render() {
		return (
			<div>
				<h2>Your Notes</h2>
				<div>
					{this.state.orderedHappyNotes.map((note) => {
						return (
							<div key={`week-${note.weekOf}`}>
								<h2>{`Week of ${note.weekOf.toString().replace('00:00:00 GMT-0400', '')}`}</h2>
								<ul>
									{note.notes.map((singleNote) => {
										return (
											<li key={`note-${singleNote.key}`} name="userNote">
												<h3>{singleNote.currentTitle}</h3>
												<p>{singleNote.currentDate.toString().replace('GMT-0400 (EDT)', '')}</p>
												<img src={singleNote.currentImage} alt=""/>
												<p>{singleNote.currentHappyNote}</p>
												<button 
													value={singleNote.key} 
													onClick={this.addToFavourites}>
													Favourite
												</button>
											</li>
										)
									})}
								</ul>
							</div>
						)
					})}
				</div>
			</div>
		)
	}
}