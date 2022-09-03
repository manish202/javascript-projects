let box = document.getElementById("box");
let add = document.getElementById("add");
let edit = document.getElementById("edit");
let modify = document.getElementById("modify");
//html to pdf
let getPdf = () => {
    html2pdf().from(document.body).save();
}
// when page load first time or user add data
const load = () => {
    try{
        if(typeof Storage != undefined){
        box.innerHTML = "";
        let list = localStorage.getItem("list");
        if(list !== null){
            list = JSON.parse(list);
            if(list.data.length){
                list.data.forEach((val) => {
                    box.insertAdjacentHTML("beforeend",
                    `<tr>
                <td>${val}</td>
                <td><button class='btn btn-success' onclick="editform('${val}')">edit</button></td>
                <td><button class='btn btn-danger' onclick="deletedata('${val}')">delete</button></td>
            </tr>`);
                });
                box.insertAdjacentHTML("beforeend",`<tr><td colspan="3"><button onclick="getPdf()" type="button" class="btn btn-dark">Download PDF</button></td></tr>`);
            }else{
                box.innerHTML = "<tr><td colspan='3'>no records found</td></tr>";
            }
            modify.innerHTML = "Last Modify "+list.modify;
        }else{
            box.innerHTML = "<tr><td colspan='3'>no records found</td></tr>";
        }
    }else{
        alert("your browser does not support localstorage");
    }
    }catch(err){
        alert(err);
    }
}
load();
const editform = (val) => {
    edit.classList.remove("d-none");
    edit.term.value = val;
    edit.setAttribute("data-name",val);
}
const deletedata = (val) => {
    let list = localStorage.getItem("list");
    list = JSON.parse(list);
    list.data = list.data.filter((val2) => {
        return val2 != val;
    });
    console.log(list.data);
    localStorage.setItem("list",JSON.stringify({data:list.data,modify: new Date().toLocaleString()}));
    load();
}
let submited = (e) => {
    e.preventDefault();
    let {name,term} = e.target;
    term = term.value.trim();
    if(typeof Storage != undefined){
        let list = localStorage.getItem("list");
        list = JSON.parse(list);
        if(term == ""){
            alert("please write something.");
        }else if(name === "add"){
            if(list === null){
                localStorage.setItem("list",JSON.stringify({data:[term],modify: new Date().toLocaleString()}));
            }else{
                let exists = list.data.includes(term);
                if(exists){
                    alert("item already exists");
                }else{
                    list.data.push(term);
                    localStorage.setItem("list",JSON.stringify({data:list.data,modify: new Date().toLocaleString()}));
                }
            }
            load();
        
        }else if(name === "edit"){
            let prev = edit.dataset.name;
            list.data = list.data.join(",").replace(prev,term).split(",");
            localStorage.setItem("list",JSON.stringify({data:list.data,modify: new Date().toLocaleString()}));
            edit.classList.add("d-none");
            edit.term.value = "";
            load();
        }else{
            alert("something is wrong");
        }
    }else{
        alert("your browser does not support localstorage");
    }
    e.target.reset();
}
add.addEventListener("submit",submited);
edit.addEventListener("submit",submited);