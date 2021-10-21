class TodoItem {
    constructor(todoDescription) {
        this.description = todoDescription
        this.done = false
    }
}

class TodoApp {
    url = "http://localhost:4730/todos"

    constructor() {
        this.getData()

        document.getElementById("btn-todo").addEventListener("click", () => this.addTodo())
    }

    renderData(todos) {
        const list = document.getElementById("todo-list")

        list.innerHTML = ""

        todos.forEach(todo => {
            const liEl = document.createElement("li")
            const todoText = todo.description

            liEl.setAttribute("data-id", todo.id)

            const checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkbox.checked = todo.done
            checkbox.id = this.createId(todoText)

            const label = document.createElement("label")
            label.setAttribute("for", checkbox.id)
            label.innerText = todoText

            const button = document.createElement("button")
            button.classList.add("btn-delete")
            button.innerText = "X"

            liEl.append(checkbox, label, button)
            list.appendChild(liEl)
        })
    }

    eventHandler() {
        const liElements = document.querySelectorAll("ul li")
        const deleteButtons = document.querySelectorAll(".btn-delete")
        const filter = document.getElementById("filter-mask")

        liElements.forEach(li => li.addEventListener("click", (e) => this.changeTodoState(e)))

        deleteButtons.forEach(button => button.addEventListener("click", (e) => this.deleteTodo(e), false))

        filter.addEventListener("change", this.filterTodos)
    }

    getData() {
        fetch(this.url)
        .then(res => res.json())
        .then(data => this.renderData(data))
        .then(() => this.eventHandler())
    }

    addTodo() {
        const textField = document.getElementById("input-todo")
        const todoText = textField.value
        const newTodo = new TodoItem(todoText)

        if (!this.checkForDuplicate(todoText) && todoText !== "") {
            this.addData(newTodo)
        } else {
            alert("Dieser Eintrag ist bereits vorhanden oder leer")
        }
        textField.value = ""
    }

    addData(data) {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        }

        fetch(this.url, requestOptions)
        .then(res => res.json())
        .then(() => this.getData())
    }

    checkForDuplicate(newTodo) {
        newTodo = this.createId(newTodo)
        const allTodos = document.querySelectorAll("input[type='checkbox']")

        for (let i = 0; i < allTodos.length; i++) {
            const currentTodo = allTodos[i].id

            if (currentTodo === newTodo) {
                return true
            }
        }
    }

    changeTodoState(e) {
        const target = e.target
        const todoId = target.getAttribute("data-id")
        const checkbox = target.querySelector("input[type='checkbox']")
        checkbox.checked = !checkbox.checked

        this.updateData(todoId, checkbox.checked)
    }

    updateData(id, state) {
        const requestOptions = {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({done: state})
        }

        fetch(this.url + `/${id}`, requestOptions)
        .then(res => res.json())
        .then(() => this.getData())
    }

    deleteTodo(e) {
        e.stopPropagation()
        const todoId = e.target.parentElement.getAttribute("data-id")
        this.deleteData(todoId)
    }

    deleteData(id) {
        fetch(this.url + `/${id}`, {method: "DELETE"})
        .then(res => res.json())
        .then(() => this.getData())
    }

    filterTodos(e) {
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

    createId(string) {
        return string.trim().replaceAll(" ", "").toLowerCase()
    }
}

new TodoApp()