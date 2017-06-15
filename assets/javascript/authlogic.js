var uid = "-KmUZTaohwghpuagw";

var database = firebase.database();
var contactsRef = database.ref('users/'+uid+'/contacts');

var provider = new firebase.auth.GoogleAuthProvider();

var user;
var token;

function login() { 
	firebase.auth().signInWithPopup(provider).then(function(result) {
		token = result.credential.accessToken;
		user = result.user;
		checkIfNewUser(user);
		console.log(user);
	}).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		var email = error.email;
		var credential = error.credential;
	});
}

function createNewUser(user) {
	console.log('trying to write to firebase');
	database.ref('users/'+user.uid+'/info').set({
		name: user.displayName,
		email: user.email
	});
	//window.location.href = 'contacts.html';
}

function checkIfNewUser(user) {
	var usersRef = database.ref('users');
	usersRef.child(user.uid).once('value', function(snapshot) {
		if (snapshot.val() === null) {
			createNewUser(user);
		} else {
			console.log("Welcome back");
			//window.location.href = 'index.html';
			return false;
		}
	});
}

function askForContactPermission() {
	provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
	provider.addScope('https://www.google.com/m8/feeds/');
	firebase.auth().signInWithPopup(provider).then(function(result) {
		token = result.credential.accessToken;
		user = result.user;
		grabContacts();
	}).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		var email = error.email;
		var credential = error.credential;
	});
}

function grabContacts() {
	$.ajax({ 
		url: "https://www.google.com/m8/feeds/contacts/" + user.email +"/full?access_token=" + token + "&alt=json", 
		dataType: "JSONP", 
		success: function(res){ 
			console.log(res); 
		}, 
		error: function(xhr,status,error){
			console.log(xhr);
			console.log(status);
			console.log(error);
		}
	});
}

$(document).on("click", "#loginButton", login);
$(document).on("click", "#getContacts", askForContactPermission);
