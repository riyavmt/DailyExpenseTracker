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
        
        const res = await axios.post("http://13.51.175.59/signup",data);
        var alert = document.getElementById("message-alert");
        if(res.data.userFound){
            
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