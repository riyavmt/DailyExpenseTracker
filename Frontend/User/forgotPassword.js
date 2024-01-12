const form = document.getElementById("forgotPasswordForm");
form.addEventListener("submit",sendEmail);

async function sendEmail(e){
    e.preventDefault();
    const email = e.target.email.value;
    try{
        const res = await axios.post('http://localhost:3000/password/forgotpassword/',{'email':email})

    }
    catch(err){
        console.log(err)
    }
}