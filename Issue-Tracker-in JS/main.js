/*Add an event handler first*/
document.getElementById('issueInputForm').addEventListener('submit', saveIssue);

function saveIssue(e)
{
	var issueDesc = document.getElementById('issueDescInput').value;
	var issueSeverity = document.getElementById('issueSeverityInput').value;
	var issueAssignedTo = document.getElementById('issueAssignedToInput').value;
	var issueId = chance.guid(); /*Returns a global unique identifier*/
	var issueStatus = 'Open';
	
	var issue = {
		
		
	}
}

function fetchIssues()
{
	/*	
		A common use of JSON is to exchange data to/from a web server.

		When receiving data from a web server, the data is always a string.

		Parse the data with JSON.parse(), and the data becomes a JavaScript object.
	*/
	var issues = JSON.parse(localStorage.getItem('issues'));
	/*issue items are stored in issues object*/
	var issuesList = document.getElementById('issuesList');
	
	issuesList.innerHTML = '';
	
	for(var i = 0; i < issues.length; i++)
	{
		var id = issues[i].id;
		var desc = issues[i].description;
		var severity = issues[i].severity;
		var assignedTo = issues[i].assignedTo;
		var status = issues[i].status;
		
		issuesList.innerHTML += '<div class="well">'+
								'<h6>Issue ID: ' + id + '</h6>'+
								'<p><span class="label label-info">' + status + '</span></p>' +
								'<h3>' + desc + '</h3>' + 
								'<p><span class="glyphicon glyphicon-time"></span>' + severity + '</p>' + 
								'<p><span class="glyphicon glyphicon-user"></span>' + assignedTo + '</p>' + 
								'a href="#" onclick="setStatusClosed(\''+id+'\')" class="btn btn-warning">Close</a>' + 
								'a href="#" onClick="deleteIssue(\''+id+'\')" class="btn btn-danger">Delete</a>'
								'</div>';
	}
}
