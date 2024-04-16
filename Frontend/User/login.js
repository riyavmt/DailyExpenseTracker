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
        console.log(res);
        const alert = document.getElementById("message-alert");
        if(res.data.userDetails){ //When the email and password matches
            alert.innerHTML = res.data.message;
            alert.style.display = "block";
            alert.style.color = "blue";
            // alert.style.fontWeight = "bold";
            
            console.log(res.data.token);
            localStorage.setItem('token',res.data.token);
            localStorage.setItem('premium',res.data.premium); //we save the token in the local storage 
            window.location.href = "/Expense/expense.html"; //and go to the expense form page
        }
        else{
            alert.innerHTML = res.data.message;
            alert.style.color = "red";
            // alert.style.fontWeight = "bold"; 
            console.log(res.data);
        }
    }
    catch(err){
        console.log(err,"ERROR");
    }
};