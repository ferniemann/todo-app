const url = "http://localhost:4730/todos"
const btnAddTodo = document.getElementById("btn-todo")
const list = document.getElementById("todo-list")

getData()

function renderList(allTodos) {
    list.innerHTML = ""
    allTodos.forEach(todo => {
        const id = todo.id
        const todoText = todo.description

        const liEl = document.createElement("li")
        liEl.setAttribute("data-id", id)
        liEl.addEventListener("click", checkTodo)

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.id = "checkbox-" + id
        checkbox.checked = todo.done

        const label = document.createElement("label")
        label.setAttribute("for", checkbox.id)
        label.innerText = todoText

        const btnDelete = document.createElement("button")
        btnDelete.classList.add("btn-delete")
        btnDelete.innerText = "X"
        btnDelete.addEventListener("click", deleteItem)

        liEl.append(checkbox, label, btnDelete)
        list.appendChild(liEl)
    })
}

function getData() {
    fetch(url)
        .then(res => res.json())
        .then(data => renderList(data))
}

function addTodo() {
    const newTodoField = document.getElementById("input-todo")
    const newTodoText = newTodoField.value
    const newTodoItem = {
        description: newTodoText,
        done: false
    }

    if (!checkDuplicate(newTodoText) && createSlug(newTodoText) !== "") {
        addData(newTodoItem)
    } else {
        alert("Entweder ist das Textfeld leer oder der Eintrag ist bereits vorhanden.")
    }

    newTodoField.value = ""
}

btnAddTodo.addEventListener("click", addTodo)

function addData(data) {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }

    fetch(url, requestOptions)
        .then(res => res.json())
        .then(() => {
            getData()
        })
}

function deleteItem(e) {
    const id = e.target.parentElement.getAttribute("data-id")

    deleteData(id)
}

function deleteData(item) {
    fetch(url + `/${item}`, {method: "DELETE"})
        .then(res => res.json())
        .then(() => {
            getData()
        })
}

function checkDuplicate(stringToCheck) {
    const allItems = document.querySelectorAll("label")

    for (let i = 0; i < allItems.length; i++) {
        const itemText = createSlug(allItems[i].innerText)
        const stringText = createSlug(stringToCheck)

        if (itemText === stringText) {
            return true
        }
    }
}

function createSlug(string) {
    return string.trim().replaceAll(" ", "").toLowerCase()
}

function checkTodo(e) {
    const target = e.target
    const targetId = target.getAttribute("data-id")
    const checkbox = target.querySelector("input[type='checkbox']")
    checkbox.checked = !checkbox.checked

    updateData(targetId, checkbox.checked)
}

function updateData(id, state) {
    const updatedData = {
        done: state
    }

    const requestOptions = {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updatedData)
    }

    fetch(url + `/${id}`, requestOptions)
        .then(res => res.json())
        .then(() => getData())
}