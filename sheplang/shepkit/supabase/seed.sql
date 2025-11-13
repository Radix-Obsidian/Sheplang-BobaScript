-- Seed data for ShepKit development
-- This file contains sample data for testing and development

-- Insert sample projects
INSERT INTO projects (user_id, name, files) VALUES 
(
  'demo-user',
  'Todo App Example',
  '[
    {
      "id": "file_todo_1",
      "name": "TodoApp.shep",
      "content": "component TodoApp {\n  state todos = []\n  state newTodo = \"\"\n  \n  \"My Todo List\"\n  \n  action AddTodo(item) {\n    todos.push(item)\n    newTodo = \"\"\n  }\n}",
      "path": "/TodoApp.shep"
    },
    {
      "id": "file_todo_2", 
      "name": "TodoItem.shep",
      "content": "component TodoItem props { text: \"\", completed: false } {\n  state isCompleted = completed\n  \n  action ToggleComplete() {\n    isCompleted = !isCompleted\n  }\n  \n  text\n}",
      "path": "/TodoItem.shep"
    }
  ]'::jsonb
),
(
  'demo-user',
  'Landing Page',
  '[
    {
      "id": "file_landing_1",
      "name": "HomePage.shep", 
      "content": "component HomePage {\n  \"Welcome to ShepKit\"\n  \"Build apps visually with ShepLang\"\n}\n\nroute \"/\" -> HomePage",
      "path": "/HomePage.shep"
    }
  ]'::jsonb
),
(
  'demo-user',
  'Counter Example',
  '[
    {
      "id": "file_counter_1",
      "name": "Counter.shep",
      "content": "component Counter {\n  state count = 0\n  \n  \"Counter: \" + count\n  \n  action Increment() {\n    count = count + 1\n  }\n  \n  action Decrement() {\n    count = count - 1\n  }\n}",
      "path": "/Counter.shep"
    }
  ]'::jsonb
);

-- Insert sample AI interactions
INSERT INTO ai_interactions (project_id, type, input, output, model_used) VALUES
(
  (SELECT id FROM projects WHERE name = 'Todo App Example' LIMIT 1),
  'explain',
  'Explain this TodoApp component',
  'This TodoApp component creates a simple todo list application. It has two pieces of state: `todos` (an array to store todo items) and `newTodo` (a string for the current input). The component displays "My Todo List" as a title and includes an `AddTodo` action that adds new items to the todos array and clears the input field.',
  'gpt-4-turbo-preview'
),
(
  (SELECT id FROM projects WHERE name = 'Counter Example' LIMIT 1),
  'debug',
  'Why is my counter not updating?',
  'The counter component looks correct. Make sure you are calling the `Increment()` and `Decrement()` actions when users interact with buttons. The state `count` should update automatically when these actions are triggered. If the UI is not reflecting changes, ensure your preview is properly connected to the transpiled BobaScript output.',
  'gpt-4-turbo-preview'
);
