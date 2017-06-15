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
		hFour.append(snapshot.val().name);

		panelHeading.append(imageHolder);
		panelHeading.append(hFour);

		divPanel.append(panelHeading);

		mainDiv.append(divPanel);

		$("#dump-div").append(mainDiv);


		var panelBody = $("<div>");
		panelBody.addClass("panel-body");

		var notes = $("<p>");
		notes.append("<h4>" + " Last time talked about: " + snapshot.val().notes + "</h4>");
		notes.append("<h5>" + " Birthday is on: " + snapshot.val().birthday + "</h5>");
		notes.append("<h6>" + " Located currently in: " + snapshot.val().city + "</h6>");

		panelBody.append(notes);

		var email = $("<a>");
		email.attr("href", "#");
		email.addClass("btn");
		email.addClass("btn-default");
		var iemail = $("<i>");
		iemail.addClass("fa");
		iemail.addClass("fa-envelope-o");
		iemail.attr("aria-hidden", "true");
		email.append(iemail);


		var phone = $("<a>");
		phone.attr("href", "#");
		phone.addClass("btn");
		phone.addClass("btn-default");
		var iphone = $("<i>");
		iphone.addClass("fa");
		iphone.addClass("fa-phone");
		iphone.attr("aria-hidden", "true");
		phone.append(iphone);


		var check = $("<a>");
		check.attr("href", "#");
		check.addClass("btn");
		check.addClass("btn-default");
		var icheck = $("<i>");
		icheck.addClass("fa");
		icheck.addClass("fa-check");
		icheck.attr("aria-hidden", "true");
		check.append(icheck);

		panelBody.append(email);
		panelBody.append(phone);
		panelBody.append(check);

		divPanel.append(panelBody);

		mainDiv.append(divPanel);

		$("#dump-div").append(mainDiv);
});

function selectionLogic(snapValues) {
	//This is where the magic happens; this function should return why someone was selected (birthday = 1, location = 2, random = 3)
	return 1;
}


		

// <div class="col-md-4">
//       <div class="panel panel-default">

//       			<div class="panel-heading">

//       				<div><img src="#"></div>
//       				<div><h4>Bob</h4></div>

//       			</div>

//       			<div class="panel-body">

//       				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque, optio corporis quae nulla aspernatur in alias at numquam rerum ea excepturi expedita tenetur assumenda voluptatibus eveniet incidunt dicta nostrum quod?</p>
//       				<a href="#" class="btn btn-default"><i class="fa fa-envelope-o" aria-hidden="true"></i></a>
//       				<a href="#" class="btn btn-default"><i class="fa fa-phone" aria-hidden="true"></i></a>
//       				<a href="#" class="btn btn-default"><i class="fa fa-check" aria-hidden="true"></i></a>
//       			</div>
//       </div>
//</div>