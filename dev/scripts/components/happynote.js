import React from 'react';
import firebase, { auth, database, provider, dbRef } from '../firebase.js';


export default class HappyNote extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentTitle: '',
			currentImage: '',
			currentHappyNote: '',
			loading: false,
			happyNotes: [],
			formSubmitted: false
		};
		this.baseState = this.state;
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.uploadPhoto = this.uploadPhoto.bind(this);
		this.resetForm = this.resetForm.bind(this);
	}
	uploadPhoto(e) {
		e.preventDefault();
		// need refactoring
		const file = this.file.files[0];
		// only store to firebase if image size is < 2mb
		if (file.size < 2048576) {
			const storageRef = firebase.storage().ref(this.props.match.params.userId);
			const thisImage = storageRef.child(this.file.files[0].name);
			this.setState({
				loading: true
			});
			thisImage.put(file).then((snapshot) => {
				thisImage.getDownloadURL().then((url) => {
					this.setState({
						currentImage: url,
						loading: false
					}) 
				}); 
			})
		} else {
			alert('File size too big 🙅🏻')
		}
	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	handleSubmit(e) {
		e.preventDefault();
		const newDate = new Date();
		// how to pass in the user object from app component to get the userId
		const userRef = firebase.database().ref(this.props.match.params.userId);
		userRef
			.push({
			title: this.state.currentTitle,
			happyNote: this.state.currentHappyNote,
			date: newDate.toString(),
			image: this.state.currentImage,
			favourited: false
			})
			.then((snapshot) => {
				const noteKey = snapshot.key;
				userRef.child(noteKey).update({
					id: noteKey
				})
			});
		userRef.once('value', (snapshot) => {
			const userDb = snapshot.val();
			if (Object.keys(userDb).length !== 0) {
				this.setState({
					formSubmitted: true 
				})
			}
		});
	}
	resetForm() {
		// need refactoring
		this.setState(this.baseState);
	}
	render() {
		const showLoadingScreen = () => {
			if (this.state.loading) {
				return (
					<div className="loadingScreen">
						<p>Loading...</p> {/*insert animated loading screen - jar filling up*/}
					</div>
				)
			}
		}
		const showSubmitted = () => {
			if (this.state.formSubmitted) {
				return (
					<div className="submittedBackground">
						<div className="submitted">
							<p>Happy Note Saved</p>
							<button onClick={this.resetForm}>Ok</button>
						</div>
					</div>
				)
			}
		}
		return (
			<div>
				<div className="noteWrapper">
					<form className="noteForm" action="" onSubmit={this.handleSubmit}>
						<h2>Write a Happy Note</h2>
						<label htmlFor="currentTitle">Title</label>
						<input 
							onChange={this.handleChange} 
							name="currentTitle" 
							value={this.state.currentTitle} 
							type="text" placeholder="Happy Note"
							required/>
						<label htmlFor="currentImage">Upload Image (Optional)</label>
						<input 
							onChange={this.uploadPhoto}
							ref={(ref) => {this.file = ref}} 
							type="file" 
							name="currentImage" 
							accept="image/*" />
						{showLoadingScreen()}
						<label htmlFor="currentHappyNote">Write Happy Note</label>
						<textarea 
							onChange={this.handleChange} 
							name="currentHappyNote" 
							value={this.state.currentHappyNote} 
							rows="10" cols="50" 
							placeholder="Today was awesome because..."
							required>
						</textarea>
						<input type="submit" value="Create Note" />
					</form>
					<div className="notePreview">
						<h2>Live Preview</h2>
						<h1>{this.state.currentTitle}</h1>
						<img src={this.state.currentImage} alt=""/>
						<p>{this.state.currentHappyNote}</p>
					</div>
				</div>
				{showSubmitted()}
			</div>
		)
	}
}