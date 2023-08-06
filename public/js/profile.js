const saveBtn = document.querySelector(".save-btn");
const profileForm = document.forms.editProfileForm;
const reader = new FileReader();
const userPfp = document.getElementById("user-pfp");
const removePicBtn = document.getElementById("remove-picture");
const profilePictureInput = document.getElementById("profile-picture");
const defaultIcon = "/static/images/profile_pictures/pfp_temp.svg";
let icon = null;

const width = 200;

// Data Object Constructor
const Data = function(username,displayName,description,email,password,icon) {
    this.username = username;
    this.displayName = displayName;
    this.description = description;
    this.email = email;
    this.password = password;
    this.icon = icon;
};

profilePictureInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    // Set the uploaded image as the source for the user-pfp element
    reader.onload = (event) => {
        // Create image and set source as data image URL of uploaded image
        const imageURL = event.target.result;
        const image = document.createElement("img");
        image.src = imageURL;

        image.onload = (e) => {
            const size = Math.min(image.width, image.height);
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = width;

            const context = canvas.getContext("2d");
            // Set offset to crop image into square
            const offsetX = (image.width - size) / 2;
            const offsetY = (image.height - size) / 2;

            // Draw image onto canvas
            context.drawImage(image, offsetX, offsetY, size, size, 0, 0, canvas.width, canvas.height);

            // Convert canvas into an data image URL
            newImageURL = canvas.toDataURL("image/jpeg", 80);

            userPfp.src = newImageURL; 
            icon = newImageURL;
            console.log(newImageURL); 
        };
    };

    reader.readAsDataURL(file);
});

// Event listener for remove profile picture
removePicBtn.addEventListener("click", async (e) => {
    userPfp.src = defaultIcon;
    icon = defaultIcon;
});

// Event listener for edit profile form submit button
saveBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    // Parse data from the forms
    const formData = new FormData(profileForm);
    let data = null;

    // Check if user wants to change image for profile picture
    console.log(icon);
    if(icon !== null) {
        // Passes data with icon
        data = new Data(formData.get("username"),formData.get("display-name"),formData.get("description"),formData.get("email"),formData.get("password"),icon);
    } else {
        // Passes data without icon
        data = new Data(formData.get("username"),formData.get("display-name"),formData.get("description"),formData.get("email"),formData.get("password"));
    }

    // Format data object to string to send
    const jString = JSON.stringify(data);

    // Perform PATCH request to update profile details
    try {
        const res = await fetch("/edit-profile", {
            method: 'PATCH',
            body: jString, // Set jString as body
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res.status === 200) {
            location.reload(); // Refresh page
        } else {
            console.log("Status code received: " + res.status);
            // Receive form validation errors (errorsArray) from backend
            const validationRes = await res.json();

            // Retrieving error message elements
            const displayErrorUsername = document.querySelector(".error-username");
            const displayErrorDisplayName = document.querySelector(".error-display-name");
            const displayErrorDescription = document.querySelector(".error-description");
            const displayErrorEmail = document.querySelector(".error-email");
            const displayErrorPassword = document.querySelector(".error-password");

            // Clearing content of error message elements
            displayErrorUsername.textContent = "";
            displayErrorDisplayName.textContent = "";
            displayErrorDescription.textContent = "";
            displayErrorEmail.textContent = "";
            displayErrorPassword.textContent = "";

            // Reseting border color style of form input fields
            document.querySelector("#username").style.borderColor = "#dddddd";
            document.querySelector("#display-name").style.borderColor = "#dddddd";
            document.querySelector("#description").style.borderColor = "#dddddd";
            document.querySelector("#email").style.borderColor = "#dddddd";
            document.querySelector("#password").style.borderColor = "#dddddd";

            // Iterating through each error of the errorsArray
            for(i in validationRes.errors) {
                // Extract type of error
                let errorType = validationRes.errors[i].msg;
                let errorMessage;
                console.log("Error type: " + errorType);

                // Display error message that corresponds with error type
                if(errorType === "usernameFormat") {
                    errorMessage = "Username should be 5 to 20 characters long.";
                    document.querySelector("#username").style.borderColor = "red";
                    displayErrorUsername.textContent += errorMessage;
                }
                if(errorType === "usernameExists") {
                    const errorMessage = "Username is already taken. Try another.";
                    document.querySelector("#username").style.borderColor = "red";
                    displayErrorUsername.textContent += errorMessage;
                }
                if(errorType === "displayNameFormat") {
                    errorMessage = "Display name should be 20 characters or less.";
                    document.querySelector("#display-name").style.borderColor = "red";
                    displayErrorDisplayName.textContent += errorMessage;
                }
                if(errorType === "descriptionFormat") {
                    errorMessage = "Description should be 100 characters or less.";
                    document.querySelector("#description").style.borderColor = "red";
                    displayErrorDescription.textContent += errorMessage;
                }
                if(errorType === "emailFormat") {
                    errorMessage = "Invalid email entered.";
                    document.querySelector("#email").style.borderColor = "red";
                    displayErrorEmail.textContent += errorMessage;
                }
                if(errorType === "emailExists") {
                    const errorMessage = "Email is already taken. Try another."
                    document.querySelector("#email").style.borderColor = "red";
                    displayErrorEmail.textContent += errorMessage;
                }
                if(errorType === "passwordFormat") {
                    errorMessage = "Password should be 6 to 15 characters long.";
                    document.querySelector("#password").style.borderColor = "red";
                    displayErrorPassword.textContent += errorMessage;
                }

            }
        }
    } catch (err) {
        console.error(err);
    }
});