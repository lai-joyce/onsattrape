var uid = "-KmUZTaohwghpuagw";

var database = firebase.database();
var contactsRef = database.ref('users/'+uid+'/contacts');

var provider = new firebase.auth.GoogleAuthProvider();
//provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

console.log("help!");

function login() { 
	firebase.auth().signInWithPopup(provider).then(function(result) {
		var token = result.credential.accessToken;
		var user = result.user;
		createNewUser(user);
		console.log(user);
	}).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		var email = error.email;
		var credential = error.credential;
	});
}

function createNewUser(user) {
	if(checkIfUserExists(user)) {
		console.log(database.ref('users/'+user.uid));
	} else {
		console.log('trying to write to firebase');
		database.ref('users/'+user.uid+'/info').set({
			name: user.displayName,
			email: user.email
		});
	}
}

function checkIfUserExists(user) {
	var usersRef = database.ref('users');
	usersRef.child(user.uid).once('value', function(snapshot) {
		return (snapshot.val() !== null);
	});
}