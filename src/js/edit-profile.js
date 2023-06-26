// Function to handle the file upload event
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  // Read the uploaded file as a data URL
  reader.readAsDataURL(file);

  // Set the uploaded image as the source for the user-pfp element
  reader.onload = () => {
    const userPfp = document.getElementById("user-pfp");
    userPfp.src = reader.result;
  };
};

// Event listener for the file input element
const profilePictureInput = document.getElementById("profile-picture");
profilePictureInput.addEventListener("change", handleFileUpload);
