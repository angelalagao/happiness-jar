import React from 'react';
import firebase, { auth, database, provider, dbRef } from '../firebase.js';
import _ from 'underscore';

export default class Favourites extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			favourites: []
		}
	}
	render() {
		return	(
			<div>
				<h2>THIS IS YOUR Favourites</h2>
				{this.state.favourites.map((favourite, i) => {
					{console.log(favourite)}
					return (
						<ul key={`note-${favourite.id}`}>
							<li key={favourite.id + i}>
								<h3>{favourite.title}</h3>
								<p>{favourite.date.replace('GMT-0400 (EDT)', '')}</p>
								<img src={favourite.image} alt=""/>
								<p>{favourite.happyNote}</p>
							</li>
						</ul>
					)
				})}
			</div>
		)
	}
	componentDidMount() {
		const userRef = firebase.database().ref(this.props.match.params.userId);
		userRef.on('value', (snapshot) => {
			const dbHappyNote = snapshot.val();
			const newFavourites = _.filter(dbHappyNote, (note) => {
				return note.favourited === true
			});
			window.newFavourites = newFavourites;
			this.setState({
				favourites: newFavourites
			})
		});
	}
	componentWillUnmount() {
		const userRef = firebase.database().ref(this.props.match.params.userId);
		userRef.off('value');
	}
}