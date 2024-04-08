//TROQUE PELA SUA URL DO CRUDCRUD
const url = 'https://crudcrud.com/api/33048d184266486ab4d1cb8bb8062eac/todo';
let currentEditingTodoId = null;

document.addEventListener('DOMContentLoaded', () => {
    // fetchTodos();
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
  const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
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
  document.getElementById('horaTarefa').value = todo.dateTime.slice(11, 16);
  document.getElementById('salvarTarefa').innerText = 'Atualizar';

  const modal = new bootstrap.Modal(document.getElementById('taskModal'));
  modal.show();
};

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
                                    <i class="fas fa-trash text-red actionButtons" onclick="deleteTodo('${todo._id}')"></i>
                                </div>
                            </div>`;
        container.innerHTML += todoElement;
    });
};
// onchange="toggleTodoDone('${todo._id}', this.checked)

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

// Função para exibir a data atual
const displayDate = () => {
    const currentDate = new Date();
    const options = {year: 'numeric', month: 'long', day: 'numeric', locale: 'pt-BR'  };
    document.getElementById('dayOfWeek').innerText = currentDate.toLocaleDateString('pt-BR', { weekday: 'long' });
    document.getElementById('date').innerText = currentDate.toLocaleDateString('pt-BR', options);
}

// Função para exibir o horário atual
const displayTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();

    // Adiciona um zero à esquerda se o número for menor que 10
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    const currentTimeString = formattedHours + ':' + formattedMinutes;

    document.getElementById('currentTime').innerText = currentTimeString;
}

// Chamada das funções para exibir a data e o horário quando a página for carregada
document.addEventListener('DOMContentLoaded', () => {
    displayDate();
    displayTime();
    // Atualiza o horário a cada minuto
    setInterval(displayTime, 60000);
});