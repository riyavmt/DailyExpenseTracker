const list = document.getElementById("leaderboardList");
const token = localStorage.getItem('token'); // we are retrieving the token from the local storage
const premium = localStorage.getItem('premium');
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener('click',logout);
async function showLeaderboard(){
    try{
        const res = await axios.get("http://localhost:3000/show-leaderboard");
        res.data.forEach(element => {
            addToList(element);
        })
    }
    catch(err){
        console.log(err);
    }
}
function addToList(element){
    const li = document.createElement('li');
    li.innerHTML = `<span>${element.name}-${element.totalExpense}</span>`;
    list.appendChild(li);
}
window.addEventListener("DOMContentLoaded",showLeaderboard);

function logout(e){
    e.preventDefault();
    var logoutConfirmed = window.confirm("Are you sure you want to logout?");
    if(logoutConfirmed){
        window.location.href = "/User/login.html";
    }
   
}

