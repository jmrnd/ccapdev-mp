const save_btn = document.querySelector(".save-btn");
// Retrieve edit profile form
const profileForm = document.forms.editProfileForm;

// Event listener for edit profile form submit button
save_btn?.addEventListener("click", async (e) => {
  e.preventDefault();
  // Parse data from the forms
  const formData = new FormData(profileForm);
    const data = {
        username: formData.get("username"),
        displayName: formData.get("display-name"),
        description: formData.get("description"),
        email: formData.get("email"),
        password: formData.get("password"),
    };
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


// TO DO: store icon image path to db