const url = "http://localhost:4730/todos"
const btnAdd = document.getElementById("btn-todo")
const filterButtons = document.querySelectorAll("#filter-mask input")

btnAdd.addEventListener("click", addTodo)
filterButtons.forEach(button => {
    button.addEventListener("click", filterTodos)
})

getData()

function renderData(todos) {
    const list = document.getElementById("todo-list")

    list.innerHTML = ""

    todos.forEach(todo => {
        const liEl = document.createElement("li")
        const todoText = todo.description

        liEl.setAttribute("data-id", todo.id)
        liEl.addEventListener("click", changeTodoState)

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.checked = todo.done
        checkbox.id = createId(todoText)

        const label = document.createElement("label")
        label.setAttribute("for", checkbox.id)
        label.innerText = todoText

        const button = document.createElement("button")
        button.classList.add("btn-delete")
        button.innerText = "X"
        button.addEventListener("click", deleteTodo)

        liEl.append(checkbox, label, button)
        list.appendChild(liEl)
    })
}

function getData() {
    fetch(url)
    .then(res => res.json())
    .then(data => renderData(data))
}

function addTodo() {
    const textField = document.getElementById("input-todo")
    const todoText = textField.value
    const newTodo = {
        description: todoText,
        done: false
    }

    if (!checkForDuplicate(todoText) && todoText !== "") {
        addData(newTodo)
    } else {
        alert("Dieser Eintrag ist bereits vorhanden oder leer")
    }
    textField.value = ""
}

function addData(data) {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }

    fetch(url, requestOptions)
    .then(res => res.json())
    .then(() => getData())
}

function checkForDuplicate(newTodo) {
    newTodo = createId(newTodo)
    const allTodos = document.querySelectorAll("input[type='checkbox']")

    for (let i = 0; i < allTodos.length; i++) {
        const currentTodo = allTodos[i].id

        if (currentTodo === newTodo) {
            return true
        }
    }
}

function changeTodoState(e) {
    const target = e.target
    const todoId = target.getAttribute("data-id")
    const checkbox = target.querySelector("input[type='checkbox']")
    checkbox.checked = !checkbox.checked

    updateData(todoId, checkbox.checked)
}

function updateData(id, state) {
    const requestOptions = {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({done: state})
    }

    fetch(url + `/${id}`, requestOptions)
    .then(res => res.json())
    .then(() => getData())
}

function deleteTodo(e) {
    e.stopPropagation()
    const todoId = e.target.parentElement.getAttribute("data-id")
    deleteData(todoId)
}

function deleteData(id) {
    fetch(url + `/${id}`, {method: "DELETE"})
    .then(res => res.json())
    .then(() => getData())
}

function filterTodos(e) {
    const btnFilter = e.target
    const btnId = btnFilter.id
    const todos = document.querySelectorAll("input[type='checkbox']")

    if(btnId === "filter-all") {
        todos.forEach(todo => {
            todo.parentElement.hidden = false
        })
    }

    if(btnId === "filter-done") {
        todos.forEach(todo => {
            if (todo.checked === false) {
                todo.parentElement.hidden = true
            } else {
                todo.parentElement.hidden = false
            }
        })
    }

    if(btnId === "filter-open") {
        todos.forEach(todo => {
            if (todo.checked === true) {
                todo.parentElement.hidden = true
            } else {
                todo.parentElement.hidden = false
            }
        })
    }
}

function createId(string) {
    return string.trim().replaceAll(" ", "").toLowerCase()
}