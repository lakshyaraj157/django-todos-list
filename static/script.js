function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function fetchtodos(){
    fetch('/api/gettodos')
    .then(response => response.json())
    .then(data => {
        let x = data.todos;
        let output = "";
        for (let i = 0; i < x.length; i++) {
            const title = x[i].title;
            const description = x[i].description;
            const uid = x[i].uid;
            output += `<tr>
                <th scope="row">${i+1}</th>
                <td>${title}</td>
                <td>${description}</td>
                <td>
                    <button class="edit btn btn-sm btn-success" id="${uid}">Edit</button>
                    <button class="delete btn btn-sm btn-danger" id="${uid}">Delete</button>
                </td>
            </tr>`;
        }
        document.getElementById("tbody").innerHTML = output;
    })
}

let submitBtn = document.getElementById("submitBtn");
let message = document.getElementById("message");

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("uid", document.forms["todoForm"]["uid"].value);
    formData.append("title", document.forms["todoForm"]["title"].value);
    formData.append("description", document.forms["todoForm"]["description"].value);
    formData.append("csrfmiddlewaretoken", getCookie("csrftoken"));

    fetch('/api/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == "error"){
            message.setAttribute("class", "alert alert-danger");
            message.innerHTML = "<strong>Error!</strong> ";
        }
        if (data.status == "success"){
            message.setAttribute("class", "alert alert-success");
            message.innerHTML = "<strong>Success!</strong> ";
            fetchtodos();
            document.forms["todoForm"]["uid"].value = "";
            document.forms["todoForm"]["title"].value = "";
            document.forms["todoForm"]["description"].value = "";
        }
        message.innerHTML += data.message;
        setTimeout(() => {
            message.innerHTML = "";
            message.setAttribute("class", "");
            message.removeAttribute("class");
        }, 2000);
    })
})

$('tbody').on('click', '.edit', (e) => {
    e.preventDefault();
    fetch(`/api/gettodo/${e.target.id}`)
    .then(response => response.json())
    .then(data => {
        let x = data.todo;
        document.forms["todoForm"]["uid"].value = x.uid;
        document.forms["todoForm"]["title"].value = x.title;
        document.forms["todoForm"]["description"].value = x.description;
    })
})

let resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
    document.forms["todoForm"]["uid"].value = "";
    document.forms["todoForm"]["title"].value = "";
    document.forms["todoForm"]["description"].value = "";
    message.setAttribute("class", "alert alert-success");
    message.innerHTML = `<strong>Success!</strong> Your form has been reset successfully!`;
    setTimeout(() => {
        message.innerHTML = "";
        message.setAttribute("class", "");
        message.removeAttribute("class");
    }, 2000);
})

$('tbody').on('click', '.delete', (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure, you want to delete this todo ?')){
        let formData = new FormData();
        formData.append('uid', e.target.id);
        formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));

        fetch('/api/delete', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status == "error"){
                message.setAttribute("class", "alert alert-danger");
                message.innerHTML = "<strong>Error!</strong> ";
            }
            if (data.status == "success"){
                message.setAttribute("class", "alert alert-success");
                message.innerHTML = "<strong>Success!</strong> ";
                fetchtodos();
                document.forms["todoForm"]["uid"].value = "";
                document.forms["todoForm"]["title"].value = "";
                document.forms["todoForm"]["description"].value = "";
            }
            message.innerHTML += data.message;
            setTimeout(() => {
                message.innerHTML = "";
                message.setAttribute("class", "");
                message.removeAttribute("class");
            }, 2000);
        })
    }else{
        return false;
    }
})