const form = document.getElementById("loginForm");
form.addEventListener("submit",login);


async function login(e){
    e.preventDefault();
    let loginData = {
        email:e.target.mail.value,
        password:e.target.password.value,
    };
    

    try{
        const res = await axios.post("http://localhost:3000/login",loginData);
        const alert = document.getElementById("message-alert");
        if(res.data.userDetails){
            alert.innerHTML = res.data.message;
            alert.style.display = "block";
            alert.style.color = "blue";
            // alert.style.fontWeight = "bold";
            console.log(res.data);
            form.reset();
        }
        else{
            alert.innerHTML = res.data.message;
            alert.style.color = "red";
            // alert.style.fontWeight = "bold";
            console.log(res.data)
        }
    }
    catch(err){
        console.log(err)
    }
}