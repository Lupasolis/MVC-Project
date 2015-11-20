"use strict";

$(document).ready(function() {

    function handleError(message) {
        $("#errorMessage").text(message);
    }
    
    function sendAjax(action, data) {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
				console.log(xhr.responseText);
                window.location = result.redirect;
            },
            error: function(xhr, status, error) {
				console.log(xhr.responseText);
                var messageObj = JSON.parse(xhr.responseText);
				console.log(messageObj); 
                handleError(messageObj.error);
            }
        });        
    }
    
    $("#signupSubmit").on("click", function(e) {
        e.preventDefault();
    
	//if any of the fields are empty
        if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '' || $("#wWin").val() == '' || $("#wLoss").val() == '' || $("#vWin").val() == ''|| $("#vLoss").val() == '') {
            handleError("All fields are required!");
            return false;
        }
        if($("#pass").val() !== $("#pass2").val()) {
            handleError("Passwords do not match");
            return false;           
        }

        sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());
        
        return false;
    });

    $("#loginSubmit").on("click", function(e) {
        e.preventDefault();
    
        if($("#user").val() == '' || $("#pass").val() == '') {
            handleError("Username or password is empty!");
            return false;
        }
    
        sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

        return false;
    });
	
	$("#searchSubmit").on("click", function(e) {
        e.preventDefault();
		
		if($("#searchName").val() == '') {
            handleError("The username is blank!");
            return false;
        }
    
        sendAjax($("#searchForm").attr("action"), $("#searchForm").serialize());

        return false;
    });
});