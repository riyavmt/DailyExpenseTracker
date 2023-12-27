const form = document.getElementById("myForm");
form.addEventListener("submit",addExpense);
const token = localStorage.getItem('token'); // we are retrieving the token from the local storage
const list = document.getElementById("myExpenseList");
const payBtn = document.getElementById("rzp-btn");
payBtn.addEventListener("click",buyPremium);
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener('click',logout);

async function addExpense(e){
    e.preventDefault();
    let expenseData = {
        amount: e.target.amount.value,
        description: e.target.description.value,
        category: e.target.category.value,
    }
    try{
        const res = await axios.post("http://localhost:3000/add-expense",expenseData,{
            headers: {
                'Authorization' : `${token}` // and sending it as a header in the post req along with the expense data
            }
        });
        addToList(res.data);
        form.reset();

    }
    catch(err){
        console.log(err);
    }
}

function addToList(expenseData){
    const li = document.createElement("li");
    li.id = expenseData.id;

    li.innerHTML = `<span>${expenseData.amount}-${expenseData.description}-${expenseData.category}</span>
    <button class = "btn btn-sm btn-dark" id = "delete" onclick = "remove('${expenseData.id}')"> Delete </button>`

    list.appendChild(li);

}

async function remove(id){
    try{
        const res = await axios.delete(`http://localhost:3000/delete-expense/${id}`);
        console.log(res.data);
        list.removeChild(document.getElementById(id));


    }
    catch(err){
        console.log(err);
    }
}
 

window.addEventListener("DOMContentLoaded",async()=>{
    try{
        const res = await axios.get("http://localhost:3000/add-expense", {
            headers: {
                'Authorization': `${token}`
            }
        });
        console.log(res.data.ExpenseList);
        res.data.ExpenseList.forEach(expense=>{
            addToList(expense);
        })
        if(!res.data.premiumUser) {
            document.getElementById('rzp-btn').style.display='block';
            
        }
        else{
            document.getElementById('rzp-btn').style.display='none'
        }

    }
    catch(err){
        console.log(err);
    }
})





async function buyPremium (e){
    // e.preventDefault;
    //  alert("You are a premium member now");
    try{
        const res = await axios.get("http://localhost:3000/purchase/buy-premium",{ //get req along with header is sent to the backend
            headers:{
                "Authorization":token
            }
        })
        console.log(res); //we have the order details in the res object
        const options = { //new object containing the key id, orderid and handler from the res.data
            "key": res.data.key_id,
            "order_id": res.data.order.id,
            "handler": async function(res){ //post req function  in the handler after the payment is successful(sent to backend)
                await axios.post("http://localhost:3000/purchase/updateTransactionStatus",{
                    order_id: options.order_id,
                    payment_id: res.razorpay_payment_id,
                    success: true
                },
                {
                    headers:{"Authorization":token}
                })
                document.querySelector('.button-container').style.display='none'; //the premium button disappears on successful payment
                alert("You are a premium user now!")
            }
        }
        
        const rzp = new Razorpay(options); //instance created 
        rzp.open(); //opens a razorpay page
        e.preventDefault();

        rzp.on('payment.failed',async function(res){ //when the payment fails,
            await axios.post("http://localhost:3000/purchase/updateTransactionStatus",{ //post req is sent to the backend
                order_id: options.order_id, 
                payment_id: res.razorpay_payment_id,
                success: false
            },
            {
                headers:{"Authorization":token}
            })
            alert("Something went wrong! Try again.")
        } )
    }
    catch(err){
        console.log(err);
    };

    
}

async function showLeaderboard(e){
    try{
        const res = await axios.get("http://localhost:3000/show-leaderboard");
        console.log(res);

    }
    catch(err){
        console.log(err);
    }
}

function logout(e){
    e.preventDefault();
    var logoutConfirmed = window.confirm("Are you sure you want to logout?");
    if(logoutConfirmed){
        window.location.href = "/Frontend/User/login.html";
    }
   
}