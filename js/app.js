
// Login Asychronous Request
$('#SignIn').click(function () {
    validateInput('validateLogin') // Form Validation

    //Sending asynchronous request
    if (authenticate.flag == true) {
        $('#SignIn').html('<img src="./images/dual-ring-loader.gif" width="32" />');

        setTimeout(function () {
            $.ajax({
                url: 'config/auth.php',
                type: authenticate.requestType[0],
                dataType: authenticate.dataType,
                data: {
                    loginEmail: Login.Email.val(),
                    loginPassword: Login.Password.val(),
                },
                success: function (asyncRequest) {
                    Login.Email.val(null);
                    Login.Password.val(null);
                    $('#loginStatus').html(asyncRequest);
                    $('#SignIn').html('Sign In');
                    setTimeout(function () {
                        $('#loginStatus').fadeOut(1000);
                    }, 5000);

                    $('#loginStatus').val(null).show();
                }
            })
        }, 3000);
        authenticate.flag = false;
        return authenticate.flag;
    }
});



// Password Verification Asychronous Request 
$('#VerifyAccount').click(function () {
    validateInput('validateAccount');

    //Sending asynchronous request
    if (authenticate.flag == true) {
        $('#VerifyAccount').html('<img src="./images/dual-ring-loader.gif" width="32" />');
        setTimeout(function () {
            $.ajax({
                url: 'config/auth.php',
                dataType: authenticate.returnType,
                type: authenticate.requestType[0],
                data: {
                    verifiedEmail: authenticate.Email.val(),
                    answer: authenticate.Answer.val(),
                    securityQuestion: authenticate.Question.val()
                },
                success: function (asyncRequest) {
                    authenticate.Email.val(null);
                    authenticate.Answer.val(null);
                    authenticate.Question.val('null');
                    $('#VerifyAccount').html('Verify');
                    if (asyncRequest.Status === true) {
                        $('#small-dialog2').html(authenticate.ChangePassword);
                        authenticate.verifiedUserId.val(asyncRequest.userId);
                    }
                    else {
                        $('#AccountVerificationStatus').html(asyncRequest.error);
                        setTimeout(function () {
                            $('#AccountVerificationStatus').fadeOut(1000);
                        }, 5000);
                        $("#AccountVerificationStatus").val(null).show();
                    }
                }
            })
        }, 3000);
        authenticate.flag = false;
        return authenticate.flag;
    }
});


// Password Reset Asychronous Request 
$('#PasswordReset').click(function () {
    validateInput('validatePassword');

    //Sending asynchronous request
    if (authenticate.flag == true) {
        $('#PasswordReset').html('<img src="./images/dual-ring-loader.gif" width="32" />');

        if (authenticate.confirmNewPassword.val() === authenticate.Password.val()) {

            setTimeout(function () {
                $.ajax({
                    url: 'config/auth.php',
                    dataType: authenticate.returnType,
                    type: authenticate.requestType[0],
                    data: {
                        password: authenticate.Password.val(),
                        userId: authenticate.verifiedUserId.val()
                    },
                    success: function (asyncRequest) {
                        authenticate.Password.val(null);
                        authenticate.confirmNewPassword.val(null);
                        $('#PasswordReset').html('Reset Password');
                        if (asyncRequest.Status == true) {
                            $('#PasswordResetStatus').html(asyncRequest.Message);
                            $('#PasswordReset').html('Redirecting...')
                            setTimeout(function () {
                                $('#PasswordResetStatus').fadeOut(1000);
                                $('#PasswordResetStatus').val(null).show();
                                location.href = 'index.html';
                            }, 5000)
                        }
                    }
                })
            }, 3000)
            authenticate.flag = false;
            return authenticate.flag;
        }
        else {
            $('#PasswordResetStatus').html('<span class="w3-animate-top w3-amber w3-btn-block w3-padding-8 w3-center">Password Does not match<br>Try Again.</span>')
            authenticate.Password.val(null);
            authenticate.confirmNewPassword.val(null);
            $('#PasswordReset').html('Reset Password');
            setTimeout(function () {
                $('#PasswordResetStatus').fadeOut(1000);
                $('#PasswordResetStatus').val(null).show()
            }, 5000)
            authenticate.flag = false;
            return authenticate.flag;
        }
    }

});

// New User Registration
$('#SignUp').click(function () {
    validateInput('validateUser');
    //Sending asynchronous request
    if (authenticate.flag == true) {
        $('#SignUp').html('<img src="./images/dual-ring-loader.gif" width="32" />');

        setTimeout(function () {
            $.ajax({
                url: 'config/auth.php',
                type: authenticate.requestType[0],
                // dataType: authenticate.returnType,
                data: {
                    fullName: SignUp.fullName.val(),
                    newUserEmail: SignUp.Email.val(),
                    telephone: SignUp.telephone.val(),
                    NewSecurityQuestion: SignUp.Question.val(),
                    answer: SignUp.Answer.val(),
                    password: SignUp.Password.val(),
                    dateOfRegistration: SignUp.getToday()
                },
                success: function (asyncRequest) {
                    SignUp.fullName.val(null);
                    SignUp.Email.val(null);
                    SignUp.telephone.val(null);
                    SignUp.Question.val('null');
                    SignUp.Answer.val(null);
                    SignUp.Password.val(null);
                    $('#SignUp').html('Sign Up');

                    $('#SignUpNotification').html(asyncRequest);
                    setTimeout(function () {
                        $('#SignUpNotification').fadeOut(1000);
                        $('#SignUpNotification').val(null).show();
                    }, 5000)
                }
            })
        }, 3000);
        authenticate.flag = false;
        return authenticate.flag;
    }
})

/**
 * 
 * @param { This function validates form controls when called.
  Each group of controls should have a unique username.
  * 
  EXAMPLE:
  *
  <input type='text' name="Username" required="true" validate />
* 
* <script>
* 
*  validateInput('validate);
* </script>
* } inputArgs 
 */

function validateInput(inputArgs) {
    let validInput = $('[' + inputArgs + ']');
    for (let formInput = 0; formInput < validInput.length; formInput++) {
        if (validInput.get(formInput).value == null || validInput.get(formInput).value == '') {
            validInput[formInput].placeholder = 'This field is required';
            return false;
        }
    }
    authenticate.flag = true;
}

var Login = {
    Email: $('#LoginEmail'),
    Password: $('#LoginPassword')
}

var SignUp = {
    fullName: $('#FullName'),
    telephone: $('#Telephone'),
    Question: $('#NewQuestion'),
    Email: $('#NewEmail'),
    Answer: $('#NewAnswer'),
    Password: $('#NewPassword'),
    /**
     * Get the current date of the client system in YYYY-DD-MM format
     */
    getToday: function () {
        // const monthNames = ["January", "February", "March", "April", "May", "June",
        //     "July", "August", "September", "October", "November", "December"];
        let dateObj = new Date();
        let month = String(dateObj.getMonth()).padStart(2, '0');
        let day = String(dateObj.getDate()).padStart(2, '0');
        let year = dateObj.getFullYear();
        let output = year + "-" + month + "-" + day;
        return output;
    }
}

var authenticate = {
    flag: false,
    Email: $('#Email'),
    Password: $('#ResetPassword'),
    returnType: 'JSON',
    requestType: ['POST', 'GET'],
    Question: $('#SecurityQuestion'),
    Answer: $('#Answer'),
    ChangePassword: $('#Reset'), //Change Password markup
    verifiedUserId: $('#VerifiedUserId'),
    confirmNewPassword: $('#ConfirmResetPassword'),
}
