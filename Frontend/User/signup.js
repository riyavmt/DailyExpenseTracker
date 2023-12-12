const form = document.getElementById("myForm");
form.addEventListener("submit",signup);


async function signup(e){
    e.preventDefault();
    let data = {
        name:e.target.name.value,
        email:e.target.mail.value,
        password:e.target.pwd.value,
    };
    

    try{
        
        const res = await axios.post("http://localhost:3000/signup",data);
        var alert = document.getElementById("message-alert");
        if(res.data.userFound){
            
            alert.innerHTML = "Email already in use!";
            alert.style.display = "block";
            alert.style.color = "red";
            form.reset();
        }
        else{
            alert.innerHTML = "Account created successfully!";
            alert.style.display = "block";
            alert.style.color = "blue";
            form.reset();
            
        }
         

    }
    catch(err){
        console.log(err)
    }
}