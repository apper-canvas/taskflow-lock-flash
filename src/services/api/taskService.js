import mockTasks from "@/services/mockData/tasks.json";

let tasks = [...mockTasks.map(task => ({
  ...task,
  dueDate: task.dueDate ? new Date(task.dueDate) : null,
  createdAt: new Date(task.createdAt),
  completedAt: task.completedAt ? new Date(task.completedAt) : null
}))];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const taskService = {
  async getAll() {
    await delay();
    return [...tasks];
  },

  async getById(id) {
    await delay();
    return tasks.find(task => task.Id === parseInt(id));
  },

  async create(taskData) {
    await delay();
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      completed: false,
      createdAt: new Date(),
      completedAt: null
    };
    tasks.push(newTask);
    return {...newTask};
  },

  async update(id, taskData) {
    await delay();
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...taskData };
      return {...tasks[index]};
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      const deletedTask = tasks[index];
      tasks.splice(index, 1);
      return {...deletedTask};
    }
    return null;
  },

  async toggleComplete(id) {
    await delay();
    const task = tasks.find(task => task.Id === parseInt(id));
    if (task) {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date() : null;
      return {...task};
    }
    return null;
  },

  async getByCategory(category) {
    await delay();
    return tasks.filter(task => task.category === category);
  },

  async getByStatus(completed) {
    await delay();
    return tasks.filter(task => task.completed === completed);
  }
};