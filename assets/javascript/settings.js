var config = {
	apiKey: "AIzaSyDp8OOm78pBLJEKkE6r4JKBg_MPzqhiCVQ",
	authDomain: "onsattrape.firebaseapp.com",
	databaseURL: "https://onsattrape.firebaseio.com",
	projectId: "onsattrape",
	storageBucket: "onsattrape.appspot.com",
	messagingSenderId: "1094671185695"
};
firebase.initializeApp(config);

var uid = "-KmUZTaohwghpuagw";

var database = firebase.database();

var contactsRef = database.ref('users/'+uid+'/contacts');

$(document).on("click", "#importGoogleContacts", askForContactPermission);

var provider = new firebase.auth.GoogleAuthProvider();

var user;
var token;


function expandModal() {
	$("#googleContactsSelector").modal();
}

// var falsy = false / null / "" / undefined / 0 ;

function displayGmailContacts(contactArray) {
	expandModal();
	var arrayLength = contactArray.length;
	for (var i = 0; i< arrayLength; i++ ) {
		if (contactArray[i].title.$t) {
			console.log(contactArray[i]);
			var tr = $('<tr>')
			.append($('<td>')
				.append($('<input type="checkbox">')));
			tr.append($('<td>')
				.text(contactArray[i].title.$t));
			if(contactArray[i].gd$phoneNumber){
				tr.append($('<td>').text(contactArray[i].gd$phoneNumber["0"].$t));
			} else {
				tr.append($('<td>'));
			}
			if(contactArray[i].gd$email){
				tr.append($('<td>').text(contactArray[i].gd$email["0"].address));
			} else {
				tr.append($('<td>'));
			}
			if(contactArray[i].gd$postalAddress){
				tr.append($('<td>').text(contactArray[i].gd$postalAddress["0"].$t));
			} else {
				tr.append($('<td>'));
			}
			tr.append($('<td>').text("bday"));
			tr.append($('<td>').text("days"));
			$('#contactTable').append(tr)
		}
	}
}

// give me the permission to access the contacts
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
		url: "https://www.google.com/m8/feeds/contacts/" + user.email +"/full?access_token=" + token + "&alt=json&max-results=9999", 
		dataType: "JSONP", 
		success: function(res){ 
			//console.log(res.feed.entry);
			displayGmailContacts(res.feed.entry);
		}, 
		error: function(xhr,status,error){
			console.log(xhr);
			console.log(status);
			console.log(error);
		}
	});
}