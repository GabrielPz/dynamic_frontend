const url = 'https://crudcrud.com/api/6dbc54b41e10492d9dd066e823615b2a/todo';

  
const updateUI = (todos) => {
    const container = document.getElementById('tasksContainer');
    container.innerHTML = ''; // Limpa o contêiner

    if (todos.length === 0) {
        container.innerHTML = `<div class="card mt-2">
                                    <div class="card-body">
                                        Ainda não há tarefas para este dia.
                                    </div>
                                </div>`;
        return;
    } 
    todos.forEach(todo => {
        const todoElement = `<div class="card my-2">
                                <div class="card-body rowDirection">
                                    <div class="form-check" style="align-self: center;">
                                        <input class="form-check-input" type="checkbox" id="doneSwitch${todo._id}" ${todo.done ? 'checked' : ''}">
                                    </div>
                                    <div class="columnDirection">
                                        <h5 class="card-title">${todo.title}</h5>
                                        <div class="rowDirection">
                                            <p class="card-text">${todo.category}</p>
                                            <i class="far fa-clock" style="margin-top: 0.25rem;"></i>
                                            <p class="card-text">${todo.dateTime.slice(11, 16)}</p>
                                        </div>
                                    </div>
                                    <i class="fas fa-edit  text-blue actionButtons" onclick="openEditModal(${JSON.stringify(todo).split('"').join("&quot;")})"></i>
                                    <i class="fas fa-trash text-red actionButtons" onclick="handleDeleteTodo('${todo._id}')"></i>
                                </div>
                            </div>`;
        container.innerHTML += todoElement;
    });
};

const handleDeleteTodo = async (id) => {
    const isConfirmed = confirm('Tem certeza que deseja deletar esta tarefa?');
    if (isConfirmed) {
        deleteTodo(id);
        return;
    } 
    console.log('Ação de deletar cancelada pelo usuário.');
};

//Services que realizam o CRUD propriamente dito
const createTodo = async (todo) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo),
        });
        const data = await response.json();
        console.log(data);
    } catch(err) {
        console.error(err);
    }
};

const fetchTodos = async () => {
    try {
        const response = await fetch(url);
        const todos = await response.json();
        updateUI(todos);
    } catch(err) {
        console.error(err);
    }
};

const updateTodo = async (id, updatedTodo) => {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTodo),
        });
        const data = await response.json();
        console.log(data);
    } catch(err) {
        console.error(err);
    }
};

const deleteTodo = async (id) => {
    try {
        await fetch(`${url}/${id}`, {
            method: 'DELETE',
        });
        await fetchTodos();
        console.log('Deleted:', id);
    } catch(err) {
        console.error(err);
    }
};

const toggleTodoDone = async (id, done) => {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({done: done}),
        });
        if (response.ok) {
            fetchTodos();
        } else {
            throw new Error('Não foi possível atualizar o estado da tarefa');
        }
    } catch(err) {
        console.error(err);
    }
};



window.handleDeleteTodo = handleDeleteTodo;
export  {toggleTodoDone, updateTodo, createTodo, fetchTodos}