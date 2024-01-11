const list = document.getElementById("leaderboardList");
async function showLeaderboard(){
    
    try{
        const res = await axios.get("http://localhost:3000/show-leaderboard");
        console.log(res.data.name, res.data.totalExpense);
        
        res.data.forEach(element => {
            addToList(element);
        });

    }
    catch(err){
        console.log(err);
    }
}

function addToList(element){
    const li = document.createElement('li');
    li.innerHTML = `<span>${element.name}-${element.totalExpense}</span>`
    list.appendChild(li);
}

window.addEventListener("DOMContentLoaded",showLeaderboard);