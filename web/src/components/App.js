import '../styles/App.scss';
import { useEffect, useState } from 'react';
import localStorage from '../services/localstorage';
import { v4 as uuid } from 'uuid';
import data from '../data/tasks';

function App() {
  /* Let's do magic! 🦄🦄🦄 */

  const [tasks, setTasks] = useState(localStorage.get('tasks', data));
  const [newTaskInput, setNewTaskInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState('all');

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.set('tasks', tasks);
    } else {
      localStorage.clear();
    }
  }, [tasks]);

  const handleFilterSelect = (event) => {
    setFilterTerm(event.target.value);
  };

  const handleFavoriteIcon = (event) => {
    const foundIndex = tasks.findIndex(
      (task) => task.id === event.currentTarget.parentNode.id
    );
    if (foundIndex !== -1) {
      tasks[foundIndex].isFavorite = !tasks[foundIndex].isFavorite;
      setTasks([...tasks]);
    }
  };

  const handleCompletedTask = (event) => {
    if (event.target.id === event.currentTarget.id) {
      const foundIndex = tasks.findIndex(
        (task) => task.id === event.currentTarget.id
      );
      if (foundIndex !== -1) {
        tasks[foundIndex].isCompleted = !tasks[foundIndex].isCompleted;
        setTasks([...tasks]);
      }
    }
  };

  const handleRemoveIcon = (event) => {
    const foundIndex = tasks.findIndex(
      (task) => task.id === event.currentTarget.parentNode.id
    );
    tasks.splice(foundIndex, 1);
    if (foundIndex !== -1) {
      setTasks([...tasks]);
    }
  };

  const handleNewTaskButton = () => {
    if (newTaskInput) {
      setTasks([
        ...tasks,
        { id: uuid(), task: newTaskInput, isCompleted: false },
      ]);
      setNewTaskInput('');
    }
  };

  const handleNewTaskInput = (event) => {
    setNewTaskInput(event.target.value);
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const filterTasks = () => {
    let filteredTasks = tasks.filter((task) =>
      task.task.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    );
    if (filterTerm === 'completed') {
      filteredTasks = filteredTasks.filter((task) => task.isCompleted);
    } else if (filterTerm === 'incomplete') {
      filteredTasks = filteredTasks.filter((task) => !task.isCompleted);
    } else if (filterTerm === 'favorites') {
      filteredTasks = filteredTasks.filter((task) => task.isFavorite);
    }
    return filteredTasks;
  };

  const renderTasks = () =>
    filterTasks().map((task) => (
      <li
        key={task.id}
        id={task.id}
        className={`task__item ${
          task.isCompleted ? 'task__item--completed' : ''
        }`}
        onClick={handleCompletedTask}
      >
        <div
          className="task__icon"
          title="Destacar tarea"
          onClick={handleFavoriteIcon}
        >
          <i className={`${task.isFavorite ? 'fas' : 'far'} fa-star`}></i>
        </div>

        <span id={task.id} className="task__name">
          {task.task}
        </span>

        <div
          className="task__icon"
          title="Eliminar tarea"
          onClick={handleRemoveIcon}
        >
          <i className="fas fa-times"></i>
        </div>
      </li>
    ));

  const totalOfTasks = filterTasks().length;

  const completedTasks = filterTasks().filter(
    (task) => task.isCompleted
  ).length;

  const incompleteTasks = totalOfTasks - completedTasks;

  const favoriteTasks = filterTasks().filter((task) => task.isFavorite).length;

  return (
    // HTML ✨

    <div className="page">
      <header className="header">
        <h1 className="header__title">
          <span>Mi lista</span> <span>de tareas</span>
        </h1>
      </header>

      <main className="main">
        <form className="form" onSubmit={handleSubmit}>
          <fieldset className="form__fieldset">
            <label className="form__label">
              Buscar:
              <input
                className="form__input"
                type="text"
                name="searchTerm"
                value={searchTerm}
                onChange={handleSearchInput}
              />
            </label>

            <label className="form__label">
              Filtrar:
              <select
                className="form__input"
                name="filterTerm"
                value={filterTerm}
                onChange={handleFilterSelect}
              >
                <option defaultValue="all">Todas</option>
                <option value="completed">Completadas</option>
                <option value="incomplete">Pendientes</option>
                <option value="favorites">Destacadas</option>
              </select>
            </label>
          </fieldset>

          <fieldset className="form__fieldset">
            <label className="form__label form__label--large">
              <input
                className="form__input form__input--large"
                type="text"
                name="newTaskInput"
                value={newTaskInput}
                onChange={handleNewTaskInput}
              />

              <input
                className="form__button"
                type="submit"
                name="newTaskButton"
                value="Crear nueva tarea"
                onClick={handleNewTaskButton}
              />
            </label>
          </fieldset>
        </form>

        <ul className="task__list">{renderTasks()}</ul>

        <ul className="task-info__list">
          <li className="task-info__item">
            <div className="task-info__result">{totalOfTasks}</div>
            {`${totalOfTasks === 1 ? 'tarea' : 'tareas'}`}
          </li>
          <li className="task-info__item">
            <div className="task-info__result">{completedTasks}</div>
            {`${completedTasks === 1 ? 'completada' : 'completadas'}`}
          </li>
          <li className="task-info__item">
            <div className="task-info__result">{incompleteTasks}</div>
            {`${incompleteTasks === 1 ? 'pendiente' : 'pendientes'}`}
          </li>
          <li className="task-info__item">
            <div className="task-info__result">{favoriteTasks}</div>
            {`${favoriteTasks === 1 ? 'destacada' : 'destacadas'}`}
          </li>
        </ul>
      </main>

      <footer className="footer">
        <p className="footer__copy">&copy; 2022 Mara Rocha</p>
        <ul className="footer__menu">
          <li className="footer__item">
            <a
              className="footer__link"
              href="https://www.instagram.com/maranhaknits"
              title="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </li>

          <li className="footer__item">
            <a
              className="footer__link"
              href="https://www.linkedin.com/in/mararochafernandez"
              title="LinkedIn"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </li>

          <li className="footer__item">
            <a
              className="footer__link"
              href="https://github.com/mararochafernandez"
              title="GitHub"
            >
              <i className="fab fa-github-alt"></i>
            </a>
          </li>

          <li className="footer__item">
            <a
              className="footer__link"
              href="https://twitter.com/maranhaknits"
              title="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default App;
