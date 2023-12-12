const form = document.getElementById("loginForm");
form.addEventListener("submit",login);


async function login(e){
    e.preventDefault();
    let loginData = {
        name:e.target.name.value,
        password:e.target.password.value,
    };
    

    try{
        
        console.log(loginData);
    }
    catch(err){
        console.log(err)
    }
}