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
var database = firebase.database();

database.ref().on("child_added", function(snapshot) {
	console.log(snapshot.val());
});