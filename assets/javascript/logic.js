

var testContact = {
	name: "Michael",
	phone: 6514429511,
	email: "michael.t.halvorson@gmail.com"
}

var database = firebase.database();
var firebaseRef = database.ref();

firebaseRef.on("value", function(snap) {
	snap.forEach(function(contact) {
		var contactVal = contact.val();
		$("#contactTable").append($("<tr>").data('key',contactVal.key).append($("<td>").text(contactVal.name)).append($("<td>").text(contactVal.telephone)).append($("<td>").text(contactVal.email)).append($("<td>").text(contactVal.days)).append($("<td>")).append($("<td>")).append($("<td>").append($("<button>").text("Edit").addClass("edit btn btn-default"))).append($("<td>").append($("<button>").text("Delete").addClass("delete btn btn-default"))))
	});
});