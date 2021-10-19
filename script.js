const url = "http://localhost:4730/todos"
const btnAddTodo = document.getElementById("btn-todo")
const list = document.getElementById("todo-list")

renderList()

function renderList() {

    fetch(url)
        .then(response => response.json())
        .then(data => {
            for(let i = 0; i < data.length; i++) {
    
                const todo = data[i]
                const todoText = todo.description
                const liEl = document.createElement("li")
                liEl.setAttribute("data-id", todo.id)

                const checkbox = document.createElement("input")
                checkbox.type = "checkbox"
                checkbox.id = todo.id
                checkbox.addEventListener("change", updateTodo)

                const label = document.createElement("label")
                label.setAttribute("for", todo.id)
                label.innerText = todoText

                const button = document.createElement("button")
                button.classList.add("btn-delete")
                button.setAttribute("data-btn-id", todo.id)
                button.innerText = "X"
                button.addEventListener("click", deleteTodo)


                liEl.append(checkbox, label, button)
                list.appendChild(liEl)
            }
        })
}

function addTodo() {
    const todoField = document.getElementById("input-todo")
    const todoText = todoField.value
    const todoItem = {
        description: todoText,
        done: false
    }

    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(todoItem)
    }

    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => console.log("Success:", data))
        .then(() => {
            list.innerHTML = ""
            todoField.value = ""
            renderList()
        })

}

function deleteTodo(e) {
    const target = e.target
    const id = target.getAttribute("data-btn-id")
    console.log(id)

    fetch(url + `/${id}`, {method: "DELETE"})
        .then(res => res.json())
        .then(() => {
            list.innerHTML = ""
            renderList()
        })
}

function updateTodo(e) {
    const target = e.target
    const id = target.id
    const doneStatus = {
        done: target.checked
    }

    fetch(url + `/${id}`, {method: "PATCH", body: JSON.stringify(doneStatus)})
        .then(response => response.json())
    
}

btnAddTodo.addEventListener("click", addTodo)