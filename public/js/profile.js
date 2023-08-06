const saveBtn = document.querySelector(".save-btn");
const profileForm = document.forms.editProfileForm;
const reader = new FileReader();
const userPfp = document.getElementById("user-pfp");
const removePicBtn = document.getElementById("remove-picture");
const defaultIcon = "/static/images/profile_pictures/pfp_temp.svg";
let icon = null;

// Data Object Constructor
const Data = function(username,displayName,description,email,password,icon) {
    this.username = username;
    this.displayName = displayName;
    this.description = description;
    this.email = email;
    this.password = password;
    this.icon = icon;
};

// Event listener for the file input element
const profilePictureInput = document.getElementById("profile-picture");
profilePictureInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    // Read the uploaded file as a data URL
    reader.readAsDataURL(file);
  
    // Set the uploaded image as the source for the user-pfp element
    reader.onload = () => {
        userPfp.src = reader.result;
        icon = reader.result; // Stores new image for profile picture
    };
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

    // Format data object to string (to send)
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
        }
    } catch (err) {
        console.error(err);
    }
    editProfileForm.reset();
});