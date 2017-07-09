$(function() {
	//FB variables
	var database = firebase.database();
	var provider = new firebase.auth.GoogleAuthProvider();

	var user;
	var token;

	//Logs people in in popup, then checks if they exist
	function login() { 
		firebase.auth().signInWithRedirect(provider);
		firebase.auth().getRedirectResult().then(function(result) {
			console.log("this is being triggered");
			if (result.credential) {
				console.log("there is a credential");
				token = result.credential.accessToken;
				user = result.user;
			}
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			var email = error.email;
			var credential = error.credential;
			console.log(error);
		});
	}

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			checkIfNewUser(user);
			console.log(user);
		}
	});

	//Checks if user exists, and redirects to home page, otherwise creates new user
	function checkIfNewUser(user) {
		var userRef = database.ref('users/' + user.uid);
		console.log("checking for user: " + user.uid);
		userRef.once('value', function(snapshot) {
			if (snapshot.val() === null) {
				createNewUser(user);
			} else {
				console.log("Welcome back");
				window.location.href = 'index.html';
				return false;
			}
		});
	}

	//Creates new user (writes settings to firebase)
	function createNewUser(user) {
		console.log('trying to write to firebase');
		database.ref('users/'+user.uid+'/info').set({
			name: user.displayName,
			gmailName: user.displayName,
			email: user.email,
			gmailEmail: user.email
		});
		window.location.href = 'contacts.html';
	}

	$(document).on("click", "#loginButton", login);
});