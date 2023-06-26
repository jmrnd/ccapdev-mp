var loginUser = {
    username: "joolzie123",
    displayName: "Joolz Ryane",
    password: "12345678",
    email: "joolzie123@gmail.com",
    bio: "hello world! :>",
    photo: "../images/profile-temp.jpg"
};

// Updates all display occurences of username
function updateUsername() {
    let displayedValue = document.getElementsByClassName("username");
    for (var i = 0; i < displayedValue.length; i++) {
        displayedValue[i].textContent = loginUser.username;
    }
}

// Updates all display occurences of display name
function updateDisplayName() {
    let displayedValue = document.getElementsByClassName("display-name");
    for (var i = 0; i < displayedValue.length; i++) {
        displayedValue[i].textContent = loginUser.displayName;
    }
}

// Updates all display occurences of description
function updateDescription() {
    let displayedValue = document.getElementsByClassName("bio");
    for (var i = 0; i < displayedValue.length; i++) {
        displayedValue[i].textContent = loginUser.bio;
    }
}

window.addEventListener('DOMContentLoaded', function() {
    const save_btn = document.querySelector(".save-btn");

    save_btn.addEventListener("click", function(e) {

        e.preventDefault();
        console.log(loginUser);

        // Store values entered in the edit profile form
        let getUsername = document.querySelector("#username").value;
        let getDisplayName = document.querySelector("#display-name").value;
        let getDescription = document.querySelector("#description").value;
        let getEmail = document.querySelector("#email").value;
        let getPassword = document.querySelector("#password").value;
        let displayedValue;

        console.log(getUsername,getDisplayName,getDescription,getEmail,getPassword);

        // Checks which details the user wants to change
        if(getUsername.length !== 0) {
            loginUser.username = getUsername; // Stores new username
            displayedValue = document.querySelector("#username");
            displayedValue.placeholder = loginUser.username; // Updates display of username
            updateUsername();
        }
        if(getDisplayName.length !== 0) {
            loginUser.displayName = getDisplayName; // Stores new display name
            displayedValue = document.querySelector("#display-name");
            displayedValue.placeholder = loginUser.displayName; // Updates display of display name
        }
        if(getDescription.length !== 0) {
            loginUser.bio = getDescription; // Stores new description
            displayedValue = document.querySelector("#description"); 
            displayedValue.placeholder = loginUser.bio; // Updates display of bio description
        }
        if(getEmail.length !== 0) {
            loginUser.email = getEmail; // Stores new email
            displayedValue = document.querySelector("#email"); 
            displayedValue.placeholder = loginUser.email; // Updates display of email
        }
        if(getPassword.length !== 0) {
            loginUser.password = getPassword; // Stores new password
        }
        console.log(loginUser);
        
        let editProfileForm = document.querySelector(".edit-profile-form");

        editProfileForm.reset();
            
    });

});

window.addEventListener('DOMContentLoaded', function() {
    const pic_btn = document.querySelector(".change-pic-btn");

    pic_btn.addEventListener("click", function(e) {

    });
});