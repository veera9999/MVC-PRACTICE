// document.addEventListener("DOMContentLoaded", function () {
const API = (() => {
  const baseURL = "http://localhost:3000/tasks";

  const getTasks = () => {
    return fetch(baseURL)
      .then((res) => res.json())
      .catch((error) => {
        console.log("Could not get the Tasks because of the error: ", error);
        throw error;
      });
  };

  const createTask = (newTask) => {
    return fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.log("Could not create Task because of the error: ", error);
        throw error;
      });
  };

  const deleteTask = (id) => {
    return fetch(`${baseURL}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .catch((error) => {
        console.log("Could not delete the task because of the error: ", error);
        throw error;
      });
  };

  return {
    getTasks,
    createTask,
    deleteTask,
  };
})();

const Model = (() => {
  class State {
    #tasks;

    constructor() {
      this.#tasks = [];
    }
    get tasks() {
      return this.#tasks;
    }
    set tasks(newTasks) {
      this.#tasks = newTasks;
    }
  }
  return {
    State,
    ...API,
  };
})();

const View = (() => {
  const tableBodyEl = document.querySelector("#table-body");
  const searchBarEl = document.querySelector("#searchbar");
  const addTaskBarEl = document.querySelector("#add-task-bar");
  const searchTaskBtnEl = document.querySelector("#search-task-btn");
  const addTaskBtnEl = document.querySelector("#add-task-btn");
  const prevBtnEl = document.querySelector("#prev-btn");
  const nextBtnEl = document.querySelector("#next-btn");
  const pageButtonsContainer = document.querySelector(".page-buttons");

  const getSearchInputValue = () => {
    return searchBarEl.value;
  };

  const getAddTaskInputValue = () => {
    return addTaskBarEl.value;
  };

  const clearSearchInputValue = () => {
    searchBarEl.value = "";
  };

  const clearAddTaskInputValue = () => {
    addTaskBarEl.value = "";
  };

  const renderTasks = (tasks) => {
    let tasksTemp = "";
    tasks.forEach((element) => {
      const taskTempItem = `<tr>
          <td>${element.id}</td>
          <td>${element.task}</td>
          <td>${element.status}</td>
          <td><button class="task-del-btn">delete</button></td>
          </tr>`;
      tasksTemp += taskTempItem;
    });
    tableBodyEl.innerHTML = tasksTemp;
  };
  return {
    tableBodyEl,
    searchBarEl,
    addTaskBarEl,
    searchTaskBtnEl,
    addTaskBtnEl,
    prevBtnEl,
    nextBtnEl,
    pageButtonsContainer,
    clearAddTaskInputValue,
    clearSearchInputValue,
    getAddTaskInputValue,
    getSearchInputValue,
    renderTasks,
  };
})();

const Controller = ((view, model) => {
  const state = new model.State();
  const init = () => {
    model.getTasks().then((tasksData) => {
      state.tasks = tasksData;
      view.renderTasks(state.tasks);
      console.log("Init Started");
    });
  };
  return {
    init,
  };
})(View, Model);

Controller.init();
// });
