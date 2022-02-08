const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

// create server
const app = express();

// set express middleware
app.use(express.json());
app.use(cors());

// create app server
const serverPort = process.env.PORT || 4000;
app.listen(serverPort, () => {
  console.log(`App listening at http://localhost:${serverPort}`);
});

// init and config data base
const db = new Database('./src/database.db', {
  // comment next line to hide data base logs in console
  verbose: console.log,
});

// endpoints

// get tasks
// http://localhost:3000/tasks
app.get('/tasks', (req, res) => {
  const query = db.prepare('SELECT * FROM tasks ORDER BY isCompleted');
  const tasks = query.all();

  res.json({
    success: 'ok',
    result: tasks,
  });
});

// add new task
// http://localhost:3000/task
app.post('/task', (req, res) => {
  const id = req.body.id;
  const name = req.body.name;

  if (id && name) {
    const query = db.prepare('SELECT id FROM tasks WHERE id = ?');
    const result = query.get(id);

    if (!result) {
      const query = db.prepare('INSERT INTO tasks (id, name) VALUES (?, ?)');
      const result = query.run(id, name);

      if (result.changes === 1) {
        res.json({
          success: true,
          result: 'Task added',
        });
      } else {
        res.json({
          success: false,
          result: 'Error: failed query',
        });
      }
    } else {
      res.json({
        success: false,
        result: 'Error: id already exists',
      });
    }
  } else {
    res.status(404).json({
      success: false,
      result: 'Error: missing body params',
    });
  }
});

// delete task
// http://localhost:3000/tasks/123456789
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;

  if (id) {
    const query = db.prepare('SELECT id FROM tasks WHERE id = ?');
    const result = query.get(id);

    if (result) {
      const query = db.prepare('DELETE FROM tasks WHERE id = ?');
      const result = query.run(id);

      if (result.changes === 1) {
        res.json({
          success: true,
          result: 'Task deleted',
        });
      } else {
        res.json({
          success: false,
          result: 'Error: failed query',
        });
      }
    } else {
      res.json({
        success: false,
        result: 'Error: id not exists',
      });
    }
  } else {
    res.status(404).json({
      success: false,
      result: 'Error: missing id',
    });
  }
});

// update task
// http://localhost:3000/tasks/123456789?isFavorite=1&isCompleted=1
app.patch('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const isFavorite = req.query.isFavorite;
  const isCompleted = req.query.isCompleted;

  if (id) {
    const query = db.prepare('SELECT id FROM tasks WHERE id = ?');
    const result = query.get(id);
    console.log(result, isFavorite, isCompleted);

    if (result) {
      if (isFavorite) {
        const query = db.prepare(
          'UPDATE tasks SET isFavorite = ? WHERE id = ?'
        );
        const result = query.run(isFavorite, id);

        if (result.changes === 1) {
          res.json({
            success: true,
            result: 'Task updated',
          });
        } else {
          res.json({
            success: false,
            result: 'Error: failed query',
          });
        }
      }

      if (isCompleted) {
        const query = db.prepare(
          'UPDATE tasks SET isCompleted = ? WHERE id = ?'
        );
        const result = query.run(isCompleted, id);

        if (result.changes === 1) {
          res.json({
            success: true,
            result: 'Task updated',
          });
        } else {
          res.json({
            success: false,
            result: 'Error: failed query',
          });
        }
      }

      if (!isFavorite && !isCompleted) {
        res.json({
          success: false,
          result: 'Error: missing query params',
        });
      }
    } else {
      res.json({
        success: false,
        result: 'Error: id not exists',
      });
    }
  } else {
    res.status(404).json({
      success: false,
      result: 'Error: missing id',
    });
  }
});

// config express static server
const staticServerPath = './src/public-react';
app.use(express.static(staticServerPath));
