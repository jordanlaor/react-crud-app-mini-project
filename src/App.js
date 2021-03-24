import React from "react";

import Task from "./components/Task/Task.component";
import tasksApi from "./api/tasks/tasks.api";
import Spinner from "./components/Spinner/Spinner.component";

import "./App.css";

class App extends React.Component {
  state = { tasks: null, isLoading: true, newTask: "Task name", nameInput: "" };

  async componentDidMount() {
    this.getApi();
  }

  getApi = async () => {
    this.setState({ isLoading: true });
    const { data } = await tasksApi.get("tasks");
    this.setState({ tasks: data, isLoading: false });
  };

  onCheckBoxChange = async (id, e) => {
    this.setState({ isLoading: true });
    await tasksApi.put(`tasks/${id}`, { isCompleted: e.target.checked });
    this.getApi();
  };

  onDelete = async (id, e) => {
    this.setState({ isLoading: true });
    await tasksApi.delete(`tasks/${id}`);
    this.getApi();
  };

  onEdit = (id, e) => {
    this.setState((state) => {
      const tasks = [...state.tasks];
      const task = tasks.find((task) => task.id === id);
      task.edit = true;
      return { tasks, nameInput: task.name };
    });
  };

  onSave = async (id, e) => {
    this.setState({ isLoading: true });
    await tasksApi.put(`tasks/${id}`, { name: this.state.nameInput });
    this.getApi();
  };

  newTaskChange = (e) => {
    this.setState({ newTask: e.target.value });
  };

  createTask = async () => {
    this.setState({ isLoading: true });
    const newTask = (await tasksApi.post("tasks", { name: this.state.newTask, createdAt: Date.now(), isCompleted: false, edit: false }))
      .data;
    this.setState((state) => {
      return { tasks: [...state.tasks, newTask], newTask: "Task name", isLoading: false };
    });
  };

  nameInputChange = (e) => {
    this.setState({ nameInput: e.target.value });
  };

  render() {
    return (
      <div className="page">
        <h1>ToDoBom!</h1>
        <div className="nav">
          <input type="text" value={this.state.newTask} onChange={this.newTaskChange} />
          <button onClick={this.createTask} disabled={this.state.isLoading}>
            Create Task
          </button>
        </div>
        <div className="tasks-wrapper">
          {(this.state.tasks &&
            this.state.tasks.map((task) => (
              <React.Fragment key={task.id}>
                <Task
                  id={task.id}
                  name={task.name}
                  created={task.createdAt}
                  isCompleted={task.isCompleted}
                  onCheckBoxChange={this.onCheckBoxChange}
                  onInputChange={this.nameInputChange}
                  nameInput={this.state.nameInput}
                  edit={task.edit}
                  isLoading={this.state.tasks.filter((item) => item.edit).length}
                >
                  {(task.edit && (
                    <button onClick={(e) => this.onSave(task.id, e)} disabled={this.state.isLoading}>
                      Save
                    </button>
                  )) || (
                    <button onClick={(e) => this.onEdit(task.id, e)} disabled={this.state.isLoading}>
                      Edit
                    </button>
                  )}
                  <button onClick={(e) => this.onDelete(task.id, e)} disabled={this.state.isLoading}>
                    Delete
                  </button>
                </Task>
              </React.Fragment>
            ))) || <Spinner />}
        </div>
      </div>
    );
  }
}

export default App;
