import { post, get, put, del } from 'axios';
const url = 'https://crudcrud.com/api/eb80a8ac925946fea0594f4a72d8d7fa/todo';

// Create
const createTodo = async (title, desc, dateTime) => {
    const todo = {
        title: title,
        desc: desc,
        dateTime: dateTime,
        done: false
    };

    try {
        const response = await post(url, todo);
        console.log(response.data);
    } catch(err) {
        console.error(err);
    }
}

// Read
const readTodos = async () => {
    try {
        const response = await get(url);
        console.log(response.data);
    } catch(err) {
        console.error(err);
    }
}

// Read By ID
const readById = async (id) => {
    try {
        const response = await get(`${url}/${id}`);
        console.log('Deleted:', id);
    } catch(err) {
        console.error(err);
    }
}

// Update
const updateTodo = async (id, updatedTodo) => {
    try {
        const response = await put(`${url}/${id}`, updatedTodo);
        console.log(response.data);
    } catch(err) {
        console.error(err);
    }
}

// Delete
const deleteTodo = async (id) => {
    try {
        const response = await del(`${url}/${id}`);
        console.log('Deleted:', id);
    } catch(err) {
        console.error(err);
    }
}
