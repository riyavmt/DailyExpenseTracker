const form = document.getElementById("myForm");
form.addEventListener("submit",addExpense);
const token = localStorage.getItem('token'); // we are retrieving the token from the local storage
const list = document.getElementById("myExpenseList");
const payBtn = document.getElementById("rzp-btn");
payBtn.addEventListener("click",buyPremium);

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
            document.getElementById('rzp-btn').style.display='block'
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
    e.preventDefault;
    //  alert("You are a premium member now");
    try{
        const res = await axios.get("http://localhost:3000/purchase/buy-premium",{
            headers:{
                "Authorization":token
            }
        })
        console.log(res);
        const options = {
            "key": res.data.key_id,
            "order_id": res.data.order.id,
            "handler": async function(res){
                await axios.post("http://localhost:3000/purchase/updateTransactionStatus",{
                    order_id: options.order_id,
                    payment_id: res.razorpay_payment_id,
                    success: true
                },
                {
                    headers:{"Authorization":token}
                })
                document.querySelector('.button-container').style.display='none';
                alert("You are a premium user now!")
            }
        }
        
        const rzp = new Razorpay(options);
        rzp.open();
        e.preventDefault();

        rzp.on('payment.failed',async function(res){
            await axios.post("http://localhost:3000/purchase/updateTransactionStatus",{
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