

var testContact = {
	name: "Michael",
	phone: 6514429511,
	email: "michael.t.halvorson@gmail.com"
}

var database = firebase.database();
var firebaseRef = database.ref();

firebaseRef.orderByChild('name').on("value", function(snap) {
	$("#contactTable td").remove();
	snap.forEach(function(contact) {
		var contactVal = contact.val();
		$("#contactTable").append($("<tr>").data('key',contact.key).data('values',contactVal).append($("<td>").text(contactVal.name)).append($("<td>").text(contactVal.telephone)).append($("<td>").text(contactVal.email)).append($("<td>").text(contactVal.days)).append($("<td>")).append($("<td>").text(contactVal.city)).append($("<td>").text(contactVal.birthday)).append($("<td>").append($("<button>").text("Edit").addClass("edit btn btn-default"))).append($("<td>").append($("<button>").text("Delete").addClass("delete btn btn-default"))))
	});
});

$(document).on("click", ".edit", editContact);
$(document).on("click", "#newContact", newContact);
$(document).on("click", ".delete", deleteContact);

var newContactEligible = false;

function newContact () {
	newContactEligible = true;
	$("#editContact").modal();
	$("#nameInput").val("");
	$("#telephoneInput").val("");
	$("#emailInput").val("");
	$("#bdayInput").val();
	$("#locationInput").val("");
	$("#saveButton").text("Add New Person");
	$("#daysBetweenInput").val(7);
	$("#saveButton").on("click", function() {
		if (newContactEligible) {
			firebaseRef.push({
				name: $("#nameInput").val().trim(),
				telephone: $("#telephoneInput").val().trim(),
				email: $("#emailInput").val().trim(),
				birthday: $("#bdayInput").val().trim(),
				city: $("#locationInput").val().trim(),
				days: Number($("#daysBetweenInput").val().trim())
			});
			newContactEligible = false;
		}
		$('#editContact').modal('hide');
	});
}

function deleteContact () {
	var row = $(this).parent().parent();
	var contactKey =  row.data('key');
	console.log(contactKey);
	$("#deleteConfirm").modal();
	$('#deleteButton').on('click', function() {
		firebaseRef.child(contactKey).remove();
		$('#deleteConfirm').modal('hide');
	});
}

function editContact () {
	newContactEligible = false;
	var row = $(this).parent().parent();
	var contactKey =  row.data('key');
	console.log(contactKey);
	$("#editContact").modal();
	$("#nameInput").val(row.data('values').name);
	$("#telephoneInput").val(row.data('values').telephone);
	$("#emailInput").val(row.data('values').email);
	$("#bdayInput").val(row.data('values').birthday);
	$("#locationInput").val(row.data('values').city);
	$("#daysBetweenInput").val(row.data('values').days);
	$("#saveButton").text("Save");
	$("#saveButton").on("click", function() {
		firebaseRef.child(contactKey).update({
			name: $("#nameInput").val().trim(),
			telephone: $("#telephoneInput").val().trim(),
			email: $("#emailInput").val().trim(),
			birthday: $("#bdayInput").val().trim(),
			city: $("#locationInput").val().trim(),
			days: Number($("#daysBetweenInput").val().trim())
		});
		$('#editContact').modal('hide');
	});
}