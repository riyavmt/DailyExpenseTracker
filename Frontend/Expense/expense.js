const form = document.getElementById("myForm");
form.addEventListener("submit",addExpense);
const list = document.getElementById("myExpenseList");
const token = localStorage.getItem('token');

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
                'Authorization' : `${token}`
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
    <button class = "btn btn-sm btn-dark" onclick = "remove('${expenseData.id}')"> Delete </button>`

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
        console.log(res.data);
        res.data.forEach(expense=>{
            addToList(expense);
        })
    }
    catch(err){
        console.log(err);
    }
})