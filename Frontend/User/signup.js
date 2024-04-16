const form = document.getElementById("myForm");
form.addEventListener("submit",signup);


async function signup(e){
    e.preventDefault();
    let data = {
        name: e.target.name.value,
        email:e.target.mail.value,
        password:e.target.password.value,
    };
    try{
        const res = await axios.post("http://localhost:3000/signup",data); //sending a post request to the backend(server) along with the data user typed on the form from the frontend when the user clicks on submit(for signup) button
        var alert = document.getElementById("message-alert");
        if(res.data.userFound){ //if that data is found already, we will show a msg that account is already there
            alert.innerHTML = res.data.message;
            alert.style.display = "block";
            alert.style.color = "red";
            form.reset();
        }
        else{
           window.location.href = "/User/login.html";
        }
    }
    catch(err){
        console.log(err)
    }
}