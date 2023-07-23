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
        icon: "static/images/profile_pictures/pfp_temp.svg"
    };

    const jString = JSON.stringify(data);

    try{
        const res = await fetch("/sign-up", {
            method: 'Post',
            body: jString,
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(res.status === 200){
            alert("Successfully Registered"); // Test Purpose
            window.location.href = "/login";
        }
    } catch (err){
        console.error(err);
    }
})
