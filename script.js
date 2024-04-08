import {createTodo, fetchTodos, updateTodo, toggleTodoDone} from './service.js'

let currentEditingTodoId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchTodos();
    displayDate();
    displayTime();
    // Atualiza o horário a cada minuto
    setInterval(displayTime, 60000);
});

document.getElementById('taskModal').addEventListener('show.bs.modal', function (event) {
    // Verifica se o modal está sendo aberto para uma nova tarefa (não tem ID de edição definido)
    if (!currentEditingTodoId) {
      document.getElementById('taskModalLabel').innerText = 'Nova Tarefa';
      document.getElementById('salvarTarefa').innerText = 'Salvar';
      // Limpa o formulário
      document.getElementById('tituloTarefa').value = '';
      document.getElementById('categoriaTarefa').value = '';
      document.getElementById('horaTarefa').value = '';
    }
});

const openEditModal = (todo) => {
    currentEditingTodoId = todo._id;
    document.getElementById('tituloTarefa').value = todo.title;
    document.getElementById('categoriaTarefa').value = todo.category;
    document.getElementById('horaTarefa').value = todo.dateTime.slice(11, 16);
    document.getElementById('taskModalLabel').innerText = 'Atualizar Tarefa';
    document.getElementById('salvarTarefa').innerText = 'Atualizar';

    const modal = new bootstrap.Modal(document.getElementById('taskModal'));
    modal.show();
};
  
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

window.openEditModal = openEditModal;
window.handleCreateTodo = handleCreateTodo;
