import React from 'react';
import firebase, { auth, database, provider, dbRef } from '../firebase.js';

export default class HappyNote extends React.Component {
	constructor() {
		super();
		this.state = {
			currentTitle: '',
			currentImage: '',
			currentHappyNote: '',
			currentDate: {},
			loading: false,
			happyNotes: []
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.uploadPhoto = this.uploadPhoto.bind(this);
	}
	uploadPhoto(e) {
		e.preventDefault();
		// need refactoring
		const file = this.file.files[0];
		const storageRef = firebase.storage().ref();
		const thisImage = storageRef.child(this.file.files[0].name);
		this.setState({
			loading: true
		});
		thisImage.put(file).then((snapshot) => {
			thisImage.getDownloadURL().then((url) => {
				console.log(url);
				this.setState({
					currentImage: url,
					loading: false
				}) 
			}); 
		})
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	handleSubmit(e) {
		e.preventDefault();
		const newDate = new Date();
		console.log(newDate);
		dbRef.push({
			title: this.state.currentTitle,
			happyNote: this.state.currentHappyNote,
			date: newDate.toString(),
			image: this.state.currentImage
		});
	}
	render() {
		const showLoadingScreen = () => {
			if (this.state.loading) {
				return (
					<div className="loadingScreen">
						<p>Loading...</p> {/*insert animated loading screen*/}
					</div>
				)
			}
		}
		return (
			<div>
				<h2>Write your note here</h2>
				<form action="" onSubmit={this.handleSubmit}>
					<input onChange={this.handleChange} name="currentTitle" value={this.state.currentTitle} type="text" placeholder="Title"/>
					<input onChange={this.uploadPhoto} ref={(ref) => {this.file = ref}} type="file" name="currentImage" accept="image/*" />
					<textarea onChange={this.handleChange} name="currentHappyNote" value={this.state.currentHappyNote} rows="10" cols="50" placeholder="Enter your happy note here"> </textarea>
					<input type="submit" value="Post Happy Note :D" />
				</form>
				<div>
					<h1>{this.state.currentTitle}</h1>
					<img src={this.state.currentImage} alt=""/>
					<p>{this.state.currentHappyNote}</p>
				</div>
				{showLoadingScreen()}
			</div>
			
		)
	}
}