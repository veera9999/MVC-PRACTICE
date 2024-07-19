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
    #filteredTasks;

    constructor() {
      this.#tasks = [];
      this.#filteredTasks = [];
    }
    get tasks() {
      return this.#tasks;
    }
    set tasks(newTasks) {
      this.#tasks = newTasks;
    }
    get filteredTasks() {
      return this.#filteredTasks;
    }
    set filteredTasks(newFilteredTasks) {
      this.#filteredTasks = newFilteredTasks;
    }

    searchTasks = (searchTerm) => {
      if (!searchTerm.trim()) {
        this.#filteredTasks = this.#tasks;
        console.log("I am not Here");
      } else {
        this.#filteredTasks = this.#tasks.filter((taskObj) =>
          taskObj.task.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log("I am Here");
      }
      console.log(this.#filteredTasks);
      return this.#filteredTasks;
    };
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
          <td><button class="task-update-btn">update</button></td>
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
    viewTasks();
    addTaskEventHandler();
    deleteTaskEventHandler();
    searchTaskEventHandler();
  };
  const viewTasks = () => {
    model
      .getTasks()
      .then((tasksData) => {
        state.tasks = tasksData;
        view.renderTasks(state.tasks);
      })
      .catch((error) => {
        console.log("Failed to fetch Tasks", error);
      });
  };

  const deleteTaskBtnPressed = (taskId) => {
    model
      .deleteTask(taskId)
      .then((data) => {
        console.log(data);
        viewTasks();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const searchTaskEventHandler = () => {
    view.searchTaskBtnEl.addEventListener("click", (event) => {
      event.preventDefault();
      const searchInputVal = view.getSearchInputValue();
      const filteredTasks = state.searchTasks(searchInputVal);
      view.renderTasks(filteredTasks);
    });
  };

  const deleteTaskEventHandler = (deleteTask) => {
    view.tableBodyEl.addEventListener("click", (event) => {
      if (event.target.classList.contains("task-del-btn")) {
        const taskId = event.target.closest("tr").firstElementChild.textContent;
        deleteTaskBtnPressed(taskId);
      }
    });
  };

  const addTaskEventHandler = () => {
    view.addTaskBtnEl.addEventListener("click", (event) => {
      event.preventDefault();
      const newTaskVal = view.getAddTaskInputValue().trim();
      if (newTaskVal === "") return;
      const newTask = {
        task: newTaskVal,
        status: "pending",
      };
      model
        .createTask(newTask)
        .then((data) => {
          console.log(data);
          view.clearAddTaskInputValue();
          viewTasks();
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  return {
    init,
  };
})(View, Model);

Controller.init();
// });
