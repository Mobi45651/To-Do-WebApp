window.onload = loadTodos;

const btn = document.getElementById("btn");
const ul = document.getElementById("todoList");

// ADD TODO
btn.addEventListener("click", async () => {
    const todoInput = document.getElementById("TODO");

    if (todoInput.value === "") {
        alert("Cannot Enter Empty Task");
        return;
    }

    await fetch("http://127.0.0.1:8000/api/todos/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: todoInput.value,
            completed: false
        })
    });

    todoInput.value = "";
    loadTodos();
});


//  LOAD TODOS (FROM DJANGO → YOUR UI)
async function loadTodos() {
    const res = await fetch("http://127.0.0.1:8000/api/todos/");
    const data = await res.json();

    ul.innerHTML = "";

    data.forEach(todo => {
        const li = document.createElement("li");
        li.className = "list";
        li.dataset.id = todo.id;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "check";
        checkbox.checked = todo.completed;

        const task = document.createElement("span");
        task.textContent = todo.title;
        task.className = "task";

        if (todo.completed) {
            task.classList.add("completed");
        }

        const del = document.createElement("img");
        del.src = "/static/del.svg";
        del.className = "Del";

        li.appendChild(checkbox);
        li.appendChild(task);
        li.appendChild(del);
        ul.appendChild(li);
    });

    checkMessage();
}


//  CHECK / UNCHECK (SAVE TO DB)
ul.addEventListener("change", async (e) => {
    if (e.target.type === "checkbox") {
        const li = e.target.closest("li");
        const id = li.dataset.id;

        await fetch(`http://127.0.0.1:8000/api/todos/${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: e.target.checked
            })
        });

        loadTodos();
    }
});


//  DELETE TODO
ul.addEventListener("click", async (e) => {
    if (e.target.classList.contains("Del")) {
        const li = e.target.closest("li");
        const id = li.dataset.id;

        await fetch(`http://127.0.0.1:8000/api/todos/${id}/`, {
            method: "DELETE"
        });

        loadTodos();
    }
});


// 💬 EMPTY MESSAGE (your original logic fixed)
function checkMessage() {
    const todoList = document.getElementById("todoList");
    const main = document.getElementById("main");
    let message = document.getElementById("empty");

    if (todoList.children.length === 0) {
        if (!message) {
            message = document.createElement("span");
            message.className = "list";
            message.id = "empty";
            message.textContent = "NO More ToDo!! :D";
            main.appendChild(message);
        }
    } else {
        if (message) {
            message.remove();
        }
    }
}