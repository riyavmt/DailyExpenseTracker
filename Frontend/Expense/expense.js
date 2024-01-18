const form = document.getElementById("myForm");
form.addEventListener("submit",addExpense);
const token = localStorage.getItem('token'); // we are retrieving the token from the local storage
const premium = localStorage.getItem('premium');
const list = document.getElementById("expenseList");
const payBtn = document.getElementById("rzp-btn");
payBtn.addEventListener("click",buyPremium);
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener('click',logout);
let flag = false;
const rowsPerPage = document.getElementById('rows');
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
        addToExpenseList(res.data);
        form.reset();

    }
    catch(err){
        console.log(err);
    }
}

function addToExpenseList(expenseData){
    const li = document.createElement("li");
    li.id = expenseData.id;

    li.innerHTML = `<span>${expenseData.amount}-${expenseData.description}-${expenseData.category}</span>
    <button class = "btn btn-sm btn-dark" id = "delete" onclick = "remove('${expenseData.id}')"> Delete </button>`

    list.appendChild(li);

}
rowsPerPage.addEventListener("change", function() {
    localStorage.setItem('rows',rowsPerPage.value);
    location.reload();
})
async function remove(id){
    try{
        const res = await axios.delete(`http://localhost:3000/delete-expense/${id}`,
        {headers:{
            "Authorization":token
        }});
        
        console.log(res.data);
        list.removeChild(document.getElementById(id));


    }
    catch(err){
        console.log(err);
    }
}
 

window.addEventListener("DOMContentLoaded",async()=>{
    const rows = localStorage.getItem('rows');

    if(rows){
        rowsPerPage.value=rows;
    }
    else localStorage.setItem('rows',rowsPerPage.value);
    try{
        const res = await axios.get(`http://localhost:3000/add-expense?page=1&rows=${rowsPerPage.value} `,{
            headers:{'Authorization':token}
        });
       
        console.log(res.data.ExpenseList);
        res.data.ExpenseList.forEach(expense=>{
            addToExpenseList(expense);
        })
        if(!res.data.premiumUser) {
            document.getElementById('rzp-btn').style.display='block';
            
        }
        else{
            document.getElementById('rzp-btn').style.display='none'
        }
        showPagination(res.data.pageData);
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
                localStorage.setItem('premium','true')
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

function leaderboard(){
    const isPremium = localStorage.getItem("premium");
    console.log(isPremium);
    console.log(typeof(isPremium));
    if(isPremium=="true"){
        window.location.href = "/Frontend/Premium/leaderboard.html";
    }
    else{
        alert("You need to buy premium membership to access the leaderboard");
    }
}

async function downloadExpense(){
    const isPremium = localStorage.getItem("premium");
    if(isPremium == "true"){
        try{
            const result = await axios.get("http://localhost:3000/download-expense",{
            headers:{
                "Authorization":token
            }
            });
            console.log(result);
            const a = document.createElement("a");
            a.href = result.data;
            a.download = 'myexpense.txt';
            a.click();
        }
        catch(err){
            console.log(err)
        }
    }
    

    else{
        alert("You need to buy premium membership to access the download feature")
    }
}

// const list = document.getElementById("showDownloadLogs");
const downloadList = document.getElementById("myDownloadList");
async function showDownloads(){
    downloadList.innerHTML='';
    const isPremium = localStorage.getItem("premium");
    if(isPremium){
        try{
            const res = await axios.get("http://localhost:3000/show-downloads",{
                headers:{
                    "Authorization":token
                }
                });
                res.data.Downloads.forEach((element,index) => {
                    addToList(element,index);
                })
                console.log("RES",res.data);
        }
        catch(err){
            console.log(err);
        }
    }
    else{
        alert("You need to buy premium membership to access this feature!")
    }
    
}


function addToList(element,index){
    const li = document.createElement('li');
    li.innerHTML = `<span>File${index+1} downloaded on ${element.date.substring(1,11)}</span> <a href="${element.fileUrl}" ><button class="btn btn-sm btn-secondary">Download</button></a>`
    downloadList.appendChild(li);
}

// window.addEventListener("DOMContentLoaded",showDownloads);


function getLiForPagination(page){
    const li =document.createElement('li');
    li.className='page-item';
    const btn = document.createElement('button');
    btn.className="btn btn-sm btn-dark"
    btn.innerHTML=page;
    btn.addEventListener('click', () => getCurrentPageExpense(page));
    li.appendChild(btn);
    return li;
}
function showPagination(pageData){
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML='';
    if(pageData.hasPreviousPage){
        const li = getLiForPagination(pageData.previousPage);
        pagination.appendChild(li);
    }
    const newLi = getLiForPagination(pageData.currentPage);
    pagination.appendChild(newLi);
    if (pageData.hasNextPage) {
        const li = getLiForPagination(pageData.nextPage);
        pagination.appendChild(li);
    }
}
async function getCurrentPageExpense(page) {
    try {
        const expenseDetails = await axios.get("http://localhost:3000/add-expense?page=${page}&rows=${rowsPerPage.value}",{
            headers:{'Authorization':token}
        });
        console.log(expenseDetails.data);
        list.innerHTML='';
        expenseDetails.data.ExpenseList.forEach((e) => addToExpenseList(e))
        showPagination(expenseDetails.data.pageData);
    } catch (err) {
        console.log(err);
    }
}





function getLiForPagination(page){
    const li =document.createElement('li');
    li.className='page-item';
    const btn = document.createElement('button');
    btn.className="btn btn-sm btn-dark"
    btn.innerHTML=page;
    btn.addEventListener('click', () => getCurrentPageExpense(page));
    li.appendChild(btn);
    return li;
}
function showPagination(pageData){
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML='';
    if(pageData.hasPreviousPage){
        const li = getLiForPagination(pageData.previousPage);
        pagination.appendChild(li);
    }
    const newLi = getLiForPagination(pageData.currentPage);
    pagination.appendChild(newLi);
    if (pageData.hasNextPage) {
        const li = getLiForPagination(pageData.nextPage);
        pagination.appendChild(li);
    }
}
async function getCurrentPageExpense(page) {
    try {
        const expenseDetails = await axios.get(`http://localhost:3000/expense/add-expense?page=${page} `,{
            headers:{'Authorization':token}
        });
        console.log(expenseDetails.data);
        list.innerHTML='';
        expenseDetails.data.expense.forEach((e) => addToExpenseList(e))
        showPagination(expenseDetails.data.pageData);
    } catch (err) {
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