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
            const validateData = await res.json(); // Recieve data

            const displayErrorUsername = buttonSignUp.parentElement.querySelector(".error-username");
            const displayErrorEmail = buttonSignUp.parentElement.querySelector(".error-email");

            // Front-end effect changes
            displayErrorEmail.textContent = ""; // Reset if clicked more
            displayErrorUsername.textContent =""; // Reset if clicked more
            buttonSignUp.parentElement.querySelector("#username").style.borderColor = "#081735";
            buttonSignUp.parentElement.querySelector("#email").style.borderColor = "#081735";

            // Check if valid
            for (const items of validateData) {
                if(items.username === data.username){
                    const errorMessage = "Username is already taken. Try another"

                    /********************************  Change style for UX purpose********************************/
                    buttonSignUp.parentElement.querySelector(".username-section").style.marginBottom = "5px";
                    buttonSignUp.parentElement.querySelector("#username").style.borderColor = "red"
                    /********************************************************************************************/

                     displayErrorUsername.textContent+= errorMessage;
                }

                if(items.email === data.email){
                    const errorMessage = "Email is already taken. Try another"

                    /********************************  Change style for UX purpose********************************/
                    buttonSignUp.parentElement.querySelector(".email-section").style.marginBottom = "5px";
                    buttonSignUp.parentElement.querySelector("#email").style.borderColor = "red"
                    /********************************************************************************************/

                    displayErrorEmail.textContent += errorMessage;
                }
            }

        }

    } catch (err){
        console.error(err);
    }
})