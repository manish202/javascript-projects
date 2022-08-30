let enter_budget = document.getElementById("enter_budget");
let budget_amt = document.getElementById("budget_amt");
let enter_exp = document.getElementById("enter_exp");
let exp_name = document.getElementById("exp_name");
let exp_amt = document.getElementById("exp_amt");
let bud = document.getElementById("bud");
let exp = document.getElementById("exp");
let balance = document.getElementById("balance");
let table = document.getElementById("table");
let tbody = document.getElementById("tbody");
let modify_elem = document.getElementById("modify");
let url = location.href.substr(0,location.href.indexOf("#"));

const toStorage = (what,{budget,exp_name,exp_amt,old_name}) => {
    if(typeof Storage !== undefined){
        let user = localStorage.getItem("user");
        if(user === null){localStorage.setItem("user",JSON.stringify({budget:0,expenses:[],modify:new Date().toLocaleString()}))}
        user = localStorage.getItem("user");
        user = JSON.parse(user);
        if(what === "updateBudget"){
            localStorage.setItem("user",JSON.stringify({...user,budget,modify:new Date().toLocaleString()}));
        }else if(what === "addExpense"){
            let isExists = user.expenses.some((obj) => obj.name === exp_name );
            if(isExists){
                alert(exp_name+" already exists");
            }else{
                user.expenses.push({name:exp_name,amt:exp_amt});
                localStorage.setItem("user",JSON.stringify({...user,modify:new Date().toLocaleString()}));
            }
        }else if(what === "updateExpense"){
            user.expenses = user.expenses.map((val) => {
                if(val.name === old_name){ return {name:exp_name,amt:exp_amt} };
                return val;
            });
            localStorage.setItem("user",JSON.stringify({...user,modify:new Date().toLocaleString()}));
        }else if(what === "load"){
            modify_elem.innerText = "Last Modify "+user.modify;
            bud.innerText = "$ "+user.budget;
            let total_bal = user.budget;
            let exp_amount = 0;
            if(user.expenses.length > 0){
                table.classList.remove("d-none");
                tbody.innerHTML = "";
                user.expenses.forEach((val) => {
                    tbody.insertAdjacentHTML("beforeend",`<tr><td>${val.name}</td><td>${val.amt}</td><td>
                    <button class='btn btn-green' type='button' onclick="updateExp('${val.name}','${val.amt}')"><i class='fa-solid fa-pen-to-square'></i></button>
                    <button class='btn btn-red' type='button' onclick="deleteExp('${val.name}')"><i class='fa-solid fa-trash-can'></i></button>
                    </td></tr>`);
                    exp_amount += Number(val.amt);
                    total_bal -= val.amt;
                });
            }else{table.classList.add("d-none")}
            exp.innerText = "$ "+exp_amount;
            if(total_bal < 0){
                balance.classList.add("red");
                balance.classList.remove("green");
            }else if(total_bal > 0){
                balance.classList.add("green");
                balance.classList.remove("red");
            }
            balance.innerText = "$ "+ total_bal;
        }else if(what === "delete"){
            user.expenses = user.expenses.filter((val) => {
                return val.name !== exp_name;
            });
            localStorage.setItem("user",JSON.stringify({...user,modify:new Date().toLocaleString()}));
        }else{
            alert("something is wrong");
        }
    }else{
        alert("your browser does not support localstorage");
    }
}

toStorage("load",{});

const updateExp = (name,amt) => {
    enter_exp.dataset.task = "updateExpense";
    enter_exp.dataset.old = name;
    enter_exp.lastElementChild.innerText = "update";
    exp_name.value = name;
    exp_amt.value = amt;
    location.assign(url + "#enter_exp");
    toStorage("load",{});
}
const deleteExp = (exp_name) => {
    toStorage("delete",{exp_name});
    toStorage("load",{});
}

enter_budget.addEventListener("submit",(e) => {
    e.preventDefault();
    if(budget_amt.value === ""){
        alert("please enter budget.");
    }else{
        toStorage("updateBudget",{budget:Math.abs(budget_amt.value)});
        toStorage("load",{});
    }
    enter_budget.reset();
});
enter_exp.addEventListener("submit",(e) => {
    e.preventDefault();
    let task = enter_exp.dataset.task;
    let old_name = enter_exp.dataset.old;
    if(exp_name.value.trim() === "" || exp_name.value === undefined){
        alert("please enter expense name");
    }else if(exp_amt.value === ""){
        alert("enter expense amount");
    }else{
        toStorage(task,{old_name,exp_name:exp_name.value.trim(),exp_amt:exp_amt.value.trim()});
        toStorage("load",{});
        if(task === "updateExpense"){
            enter_exp.dataset.task = "addExpense";
            enter_exp.dataset.old = "0";
            enter_exp.lastElementChild.innerText = "add expense";
            location.assign(url + "#tbody");
        }
        enter_exp.reset();
    }
})