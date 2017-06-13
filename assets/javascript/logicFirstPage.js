alert("working");
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

contactsRef.on("child_added", function(snapshot) {
	console.log(snapshot.val());
});