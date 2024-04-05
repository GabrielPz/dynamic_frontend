const url = 'https://crudcrud.com/api/bf82942d809d42c292b7f93e6e2f8f26/todo';

const handleCreateTodo = async () => {
  const titulo = document.getElementById('tituloTarefa').value;
  const categoria = document.getElementById('categoriaTarefa').value;
  const hora = document.getElementById('horaTarefa').value;
  
  await createTodo(titulo, categoria, hora);
  
  const modalElement = document.getElementById('exampleModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();

  document.getElementById('tituloTarefa').value = '';
  document.getElementById('categoriaTarefa').value = '';
  document.getElementById('horaTarefa').value = '';
}


const createTodo = async (title, category, dateTime) => {
    const todo = {
        title: title,
        category: category,
        dateTime: dateTime,
        done: false
    };

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

const readTodos = async () => {
  try {
      const response = await fetch(url);
      const todos = await response.json();
      console.log(todos);
  } catch(err) {
      console.error(err);
  }
};

const readById = async (id) => {
  try {
      const response = await fetch(`${url}/${id}`)
      const todos = await response.json();
      console.log(todos)
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
      console.log('Deleted:', id);
  } catch(err) {
      console.error(err);
  }
};
