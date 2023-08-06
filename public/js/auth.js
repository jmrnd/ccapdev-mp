const signUpForm = document.forms.signupForm;
const buttonSignUp = document.querySelector("#signupForm button");

buttonSignUp.addEventListener("click", async (e) => {
    e.preventDefault();

    // Get Data
    const formData = new FormData(signUpForm);
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        joinDate: new Date(),
        icon: "/static/images/profile_pictures/pfp_temp.svg"
    };

    const jString = JSON.stringify(data);

    try{
        const res = await fetch("/sign-up", {
            method: 'Post',
            body: jString,
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (res.status === 200) {
            const contentSection = document.querySelector(".sign-up-content-container");
            const changeSizeContainer = document.querySelector(".sign-up-container");


            const innerHTML = `
            <div class="d-flex flex-column justify-content-center align-items-center py-0">
                <div class="d-flex flex-column justify-content-center align-items-center successful px-4 py-3">

                    <p id="success-title"> SUCCESS! </p>
                    <p id="success-message"> Your account has been created </p>
                    <i class="fa-solid fa-circle-check success-img" style="color: #7933ff;"></i>

                    <a href="/login" class="btn btn-sm rounded px-4 py-2 success"> Continue </a>
                </div>
            `

            changeSizeContainer.style.removeProperty('height');
            contentSection.innerHTML = innerHTML;

        }else{
            const validationResult= await res.json(); // Recieve data
            console.log(validationResult.errors)

            // Retrieving error message elements
            const displayErrorUsername = buttonSignUp.parentElement.querySelector(".error-username");
            const displayErrorEmail = buttonSignUp.parentElement.querySelector(".error-email");
            const displayErrorPassword = buttonSignUp.parentElement.querySelector(".error-password");

            // Reset content of error message elements
            displayErrorEmail.textContent = "";
            displayErrorUsername.textContent ="";
            displayErrorPassword.textContent ="";

            // Reseting style of form input fields
            buttonSignUp.parentElement.querySelector("#username").style.borderColor = "#081735";
            buttonSignUp.parentElement.querySelector("#email").style.borderColor = "#081735";
            buttonSignUp.parentElement.querySelector("#password").style.borderColor = "#081735"

            // Check if valid
            for (const items of validationResult.errors) {
                var errorType = items.msg;

                if(errorType === "usernameFormat") {
                    errorMessage = "Username should be 5 to 20 characters long.";
                    document.querySelector("#username").style.borderColor = "red";
                    buttonSignUp.parentElement.querySelector(".username-section").style.marginBottom = "5px";
                    displayErrorUsername.textContent += errorMessage;
                }
                if(errorType === "usernameExists") {
                    const errorMessage = "Username is already taken. Try another.";
                    document.querySelector("#username").style.borderColor = "red";
                    buttonSignUp.parentElement.querySelector(".username-section").style.marginBottom = "5px";
                    displayErrorUsername.textContent += errorMessage;
                }

                if(errorType === "emailFormat") {
                    errorMessage = "Invalid email entered.";
                    document.querySelector("#email").style.borderColor = "red";
                    buttonSignUp.parentElement.querySelector(".email-section").style.marginBottom = "5px";
                    displayErrorEmail.textContent += errorMessage;
                    return;
                }
                if(errorType === "emailExists") {
                    const errorMessage = "Email is already taken. Try another."
                    document.querySelector("#email").style.borderColor = "red";
                    buttonSignUp.parentElement.querySelector(".email-section").style.marginBottom = "5px";
                    displayErrorEmail.textContent += errorMessage;
                }
                if(errorType === "passwordFormat") {
                    errorMessage = "Password should be 6 to 15 characters long.";
                    document.querySelector("#password").style.borderColor = "red";
                    displayErrorPassword.textContent += errorMessage;
                }
            }

        }

    } catch (err){
        console.error(err);
    }
})