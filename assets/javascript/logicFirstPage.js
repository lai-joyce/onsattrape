//alert("working");
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
	if (selectionLogic(snapshot.val())>0) {
		console.log(snapshot.val().name);


	}

	var mainDiv = $("<div>");
	mainDiv.data("key", snapshot.key);
	mainDiv.addClass("col-md-4");
	mainDiv.addClass("mainDiv");

	var divPanel = $("<div>");
	divPanel.addClass("panel");
	divPanel.addClass("panel-default");

	var panelHeading = $("<div>");
	panelHeading.addClass("panel-heading");

	var imageHolder = $("<img>");
	imageHolder.attr("src", "#");

	var hFour = $("<h4>");
	hFour.attr("id", "contactName");
	hFour.append(snapshot.val().name);

	panelHeading.append(imageHolder);
	panelHeading.append(hFour);

	divPanel.append(panelHeading);

	mainDiv.append(divPanel);

	$("#dump-div").append(mainDiv);


	var panelBody = $("<div>");
	panelBody.addClass("panel-body");

	var notes = $("<p>");
	notes.attr("id", "notesParagraph");
	notes.append("<h4>" + " Last time talked about: " + snapshot.val().lastTalked + "</h4>");

	if (snapshot.val().birthday !== null && snapshot.val().birthday !== "") {
		notes.append("<h5>" + " Birthday is on: " + snapshot.val().birthday + "</h5>");
	}

	if (snapshot.val().city !== null && snapshot.val().city !== "") {
		notes.append("<h6>" + " Located currently in: " + snapshot.val().city + "</h6>");
	}

	panelBody.append(notes);

	var email = $("<a>");
	email.attr("href", "mailto:" + snapshot.val().email);
	email.addClass("btn btn-default hidden-md hidden-lg");
	//email.addClass("btn-default");
	var iemail = $("<i>");
	iemail.addClass("fa");
	iemail.addClass("fa-envelope-o");
	iemail.attr("aria-hidden", "true");
	email.append(iemail);

	var gmail = $("<a>");
	gmail.attr("href", "https://mail.google.com/mail/?view=cm&fs=1&to=" + snapshot.val().email);
	gmail.attr("target", "_blank");
	gmail.attr("id", "gmailID");
	gmail.addClass("btn btn-default hidden-sm hidden-xs");
	//gmail.addClass("btn-default");
	var igemail = $("<i>");
	igemail.addClass("fa");
	igemail.addClass("fa-envelope-o");
	igemail.attr("aria-hidden", "true");
	igemail.text(" gmail");
	gmail.append(igemail);


	var phone = $("<a>");
	phone.attr("href", "tel:" + snapshot.val().telephone);
	phone.attr("id", "phoneLine");
	phone.addClass("btn");
	phone.addClass("btn-default");
	var iphone = $("<i>");
	iphone.addClass("fa");
	iphone.addClass("fa-phone");
	iphone.attr("aria-hidden", "true");
	phone.append(iphone);


	var check = $("<a>");
		//check.attr("href", "#");
		check.addClass("checkMark");
		check.addClass("btn");
		check.addClass("btn-default");
		var icheck = $("<i>");
		icheck.addClass("fa");
		icheck.addClass("fa-check");
		icheck.attr("aria-hidden", "true");
		check.append(icheck);


		if (snapshot.val().email !== null) {
			panelBody.append(email);
			panelBody.append(gmail)
		}

		if (snapshot.val().phone !== null) {
			panelBody.append(phone);
		}

		panelBody.append(check);


		var viewNotes = $("<a>");
		//check.attr("href", "#");
		viewNotes.addClass("checkMark");
		viewNotes.addClass("btn");
		viewNotes.addClass("btn-default");
		var iNotes = $("<i>");
		iNotes.addClass("fa");
		//iNotes.addClass("fa-check");
		iNotes.attr("aria-hidden", "true");
		iNotes.text("View Notes");
		viewNotes.append(iNotes);

		panelBody.append(viewNotes);


		divPanel.append(panelBody);

		mainDiv.append(divPanel);

		$("#dump-div").append(mainDiv);

	});

function selectionLogic(snapValues) {
	//This is where the magic happens; this function should return why someone was selected (birthday = 1, location = 2, random = 3)
	return 1;
}



$(document).on("click",".checkMark", removeDiv);

function removeDiv() {


	//console.log("something");
	//$(this).parent().parent().parent().remove();
// 	$("#dump-div").empty();
	var key = $(this).parent().parent().parent().data('key');
	addNote(key);
	mostRecentContact(key);
	//createNewModal();
	
}

function addNote(key) {
	console.log(key.notes);
	contactsRef.child(key).child('notes').push({
		date: '2017-06-14'
	})
}

function mostRecentContact(key) {
	contactsRef.child(key).update({
		lastTalked: '2017-06-14'
	})
}



function createNewModal() {

}











