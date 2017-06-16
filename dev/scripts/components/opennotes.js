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
		}
		this.addToFavourites = this.addToFavourites.bind(this);
	}
	componentDidMount() {
		const userRef = firebase.database().ref(this.props.match.params.userId);
		userRef.on('value', (snapshot) => {
			let newHappyNotes = [];
			let orderedHappyNotes = [];
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
			const sortedDates = orderedHappyNotes.sort((a,b) => {
				return new Date(b.weekOf) - new Date(a.weekOf)
			});
			this.setState({
				orderedHappyNotes: sortedDates
			});
		});
	}
	componentWillUnmount() {
		const userRef = firebase.database().ref(this.props.match.params.userId);
		userRef.off('value');
	}
	addToFavourites(key) {
		const userRef = firebase.database().ref(this.props.match.params.userId).child(key);
		userRef.update({
			favourited: true
		});
	}
	// need to show the user the week of notes they are reviewing
	render() {
		return (
			<div className="happinessJar">
				<h2>Your <span className="notesTitle">Happy Notes</span></h2>
				<div>
					{this.state.orderedHappyNotes.map((note,i) => {
						return (
							<div className="week" key={`week-${note.weekOf + i}`}>
								<h3 className="weekOf">{`Week of ${note.weekOf.toString().replace('00:00:00 GMT-0400', '')}`}</h3>
								<ul className="happyNotes">
									{note.notes.map((singleNote) => {
										return (
											<li className="happyNote"
												key={`note-${singleNote.key}`} 
												name="userNote">
												<h3>{singleNote.currentTitle}</h3>
												<p>{singleNote.currentDate.toString().replace('GMT-0400 (EDT)', '')}</p>
												<div className="noteContent">
													<img src={singleNote.currentImage} alt=""/>
													<p className="noteText">{singleNote.currentHappyNote}</p>
												</div>
												<button>
													<i 	name="pinNote"
														onClick={() => this.addToFavourites(singleNote.key)} 
														className="fa fa-thumb-tack" aria-hidden="true">
													</i>
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