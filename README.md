# TODO APP
An mvp JS Todo App

## Task
### Introduction
This repository contains a possible mvp example of the todo app we created during the course of our class. It contains all the features we included during the past few weeks (adding todos, checking/unchecking todos, deleting todos, filtering todos, fetching API data with ``GET/DELETE/PATCH``). You may want to use this repository by cloning into your local coding directory (``git clone git@github.com:ferniemann/todo-app.git``, then change into the app's directory via ``cd todo-app`` and change into the 'example-without-class' branch via ``git checkout example-without-class``), if you don't have a fully working todo app yet.

### Task 1: Add ``class`` constructors
As you can see, at certain points in our ``script.js`` we create and pass on objects (``const newTodo`` [script.js: 52] and ``const requestOptions`` [script.js: 66, 100]). Instead of creating each object manually, create a ``class Todo`` and ``class RequestOptions`` with a ``constructor()`` that creates a blueprint of both objects.

### How to use this app?
To make this app functional, you first need to clone [this repository](https://github.com/coding-bootcamps-eu/todo-api) locally. This is the API we are connecting our app to. To start the API's server, ``cd`` into the cloned API repository, run ``npm install`` to install all dependencies and then ``npm start`` to start the local server. You can then access the API via ``localhost`` on ``http://localhost:4730/todos``.