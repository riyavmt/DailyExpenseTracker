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
        if(res.data.userDetails){ //When the email and password matches
            alert.innerHTML = res.data.message;
            alert.style.display = "block";
            alert.style.color = "blue";
            // alert.style.fontWeight = "bold";
            console.log(res.data);
            console.log(res.data.token);
            localStorage.setItem('token',res.data.token) //we save the token in the local storage 
            window.location.href = "/Frontend/Expense/expense.html" //and go to the expense form page
        }
        else{
            alert.innerHTML = res.data.message;
            alert.style.color = "red";
            // alert.style.fontWeight = "bold";
            console.log(res.data)
        }
    }
    catch(err){
        console.log(res.data)
    }
}