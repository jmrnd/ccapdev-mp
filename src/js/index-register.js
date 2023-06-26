// let receivedData = localStorage.getItem("reg_users"); // Retrieve data from local storage
// console.log(receivedData); // Output the received data

// Temporary changed img
const changed_img = "../images/profile_pictures/pfp_temp.svg";

window.onload = function () {
  let urlParams = new URLSearchParams(window.location.search);
  let username = urlParams.get("username");

  if (username != 0) {
    document.querySelector(".username").textContent = username;
    document.querySelector(".profile-image-drop-down").src = changed_img;
    document.querySelector(".create-pfp").src = changed_img;
  }
};
