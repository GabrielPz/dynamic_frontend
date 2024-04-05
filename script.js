
//TROQUE PELA SUA URL DO CRUDCRUD
const url = '';
let currentEditingTodoId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchTodos();
});

const handleCreateTodo = async () => {
  const titulo = document.getElementById('tituloTarefa').value;
  const categoria = document.getElementById('categoriaTarefa').value;
  const hora = document.getElementById('horaTarefa').value;

  const dateTime = `2023-04-28T${hora}:00`;

  const todo = {
      title: titulo,
      category: categoria,
      dateTime: dateTime,
      done: false, // Assume que a tarefa está não concluída por padrão
  };

  if (currentEditingTodoId) {
      await updateTodo(currentEditingTodoId, todo);
      currentEditingTodoId = null; // Reseta o ID após a atualização
  } else {
      await createTodo(todo);
  }

  fetchTodos(); // Atualiza a lista de tarefas

  // Fecha a modal e reseta o formulário
  const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
  modal.hide();
  document.getElementById('tituloTarefa').value = '';
  document.getElementById('categoriaTarefa').value = '';
  document.getElementById('horaTarefa').value = '';
  document.getElementById('salvarTarefa').innerText = 'Salvar'; // Reseta o texto do botão
};


const openEditModal = (todo) => {
  currentEditingTodoId = todo._id;
  document.getElementById('tituloTarefa').value = todo.title;
  document.getElementById('categoriaTarefa').value = todo.category;
  // Assegura que apenas as horas são ajustadas
  document.getElementById('horaTarefa').value = todo.dateTime.slice(11, 16);

  document.getElementById('salvarTarefa').innerText = 'Atualizar';

  const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
  modal.show();
};

const updateUI = (todos) => {
    const container = document.getElementById('tasksContainer');
    container.innerHTML = ''; // Limpa o contêiner

    if (todos.length === 0) {
        container.innerHTML = `<div class="card">
                                    <div class="card-body">
                                        Ainda não há tarefas para este dia.
                                    </div>
                                </div>`;
    } else {
        todos.forEach(todo => {
            const todoElement = `<div class="card my-2">
                                      <div class="card-body">
                                          <h5 class="card-title">${todo.title}</h5>
                                          <p class="card-text">${todo.category}</p>
                                          <p class="card-text">${todo.dateTime.slice(11, 16)}</p>
                                          <div class="form-check form-switch">
                                              <input class="form-check-input" type="checkbox" id="doneSwitch${todo._id}" ${todo.done ? 'checked' : ''} onchange="toggleTodoDone('${todo._id}', this.checked)">
                                              <label class="form-check-label" for="doneSwitch${todo._id}">Concluída</label>
                                          </div>
                                          <button onclick="openEditModal(${JSON.stringify(todo).split('"').join("&quot;")})" class="btn btn-primary">Editar</button>
                                          <button onclick="deleteTodo('${todo._id}')" class="btn btn-danger">Excluir</button>
                                      </div>
                                  </div>`;
            container.innerHTML += todoElement;
        });
    }
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
            body: JSON.stringify({ done }),
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