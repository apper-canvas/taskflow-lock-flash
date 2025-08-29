const tableName = 'task_c';

export const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "time_spent_c"}},
          {"field": {"Name": "timer_state_is_running_c"}},
          {"field": {"Name": "timer_state_last_updated_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      const tasks = (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        category: task.category_c?.Name || '',
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c ? new Date(task.due_date_c) : null,
        completed: task.completed_c || false,
        completedAt: task.completed_at_c ? new Date(task.completed_at_c) : null,
        timeSpent: task.time_spent_c || 0,
        createdAt: task.CreatedOn ? new Date(task.CreatedOn) : new Date(),
        timerState: {
          isRunning: task.timer_state_is_running_c || false,
          lastUpdated: task.timer_state_last_updated_c ? new Date(task.timer_state_last_updated_c) : null
        }
      }));

      return tasks;
    } catch (error) {
      console.error("Error in taskService.getAll:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "time_spent_c"}},
          {"field": {"Name": "timer_state_is_running_c"}},
          {"field": {"Name": "timer_state_last_updated_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);

      if (!response.success) {
        console.error("Error fetching task:", response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        return null;
      }

      // Transform data to match UI expectations
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        category: task.category_c?.Name || '',
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c ? new Date(task.due_date_c) : null,
        completed: task.completed_c || false,
        completedAt: task.completed_at_c ? new Date(task.completed_at_c) : null,
        timeSpent: task.time_spent_c || 0,
        createdAt: task.CreatedOn ? new Date(task.CreatedOn) : new Date(),
        timerState: {
          isRunning: task.timer_state_is_running_c || false,
          lastUpdated: task.timer_state_last_updated_c ? new Date(task.timer_state_last_updated_c) : null
        }
      };
    } catch (error) {
      console.error("Error in taskService.getById:", error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Get category ID for lookup field
      let categoryId = null;
      if (taskData.category) {
        const categoryResponse = await apperClient.fetchRecords('category_c', {
          fields: [{"field": {"Name": "Id"}}, {"field": {"Name": "Name"}}],
          where: [{"FieldName": "Name", "Operator": "ExactMatch", "Values": [taskData.category]}]
        });
        
        if (categoryResponse.success && categoryResponse.data && categoryResponse.data.length > 0) {
          categoryId = categoryResponse.data[0].Id;
        }
      }

      const params = {
        records: [{
          title_c: taskData.title || '',
          description_c: taskData.description || '',
          category_c: categoryId,
          priority_c: taskData.priority || 'medium',
          due_date_c: taskData.dueDate ? taskData.dueDate.toISOString().split('T')[0] : null,
          completed_c: false,
          completed_at_c: null,
          time_spent_c: 0,
          timer_state_is_running_c: false,
          timer_state_last_updated_c: null
        }]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        console.error("Error creating task:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Fetch the created task to get full data including lookup fields
          return await this.getById(result.data.Id);
        } else {
          throw new Error(result.message || "Failed to create task");
        }
      }

      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error in taskService.create:", error);
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id)
      };

      // Handle category lookup
      if (taskData.category !== undefined) {
        if (taskData.category) {
          const categoryResponse = await apperClient.fetchRecords('category_c', {
            fields: [{"field": {"Name": "Id"}}, {"field": {"Name": "Name"}}],
            where: [{"FieldName": "Name", "Operator": "ExactMatch", "Values": [taskData.category]}]
          });
          
          if (categoryResponse.success && categoryResponse.data && categoryResponse.data.length > 0) {
            updateData.category_c = categoryResponse.data[0].Id;
          }
        } else {
          updateData.category_c = null;
        }
      }

      // Map other fields
      if (taskData.title !== undefined) updateData.title_c = taskData.title;
      if (taskData.description !== undefined) updateData.description_c = taskData.description;
      if (taskData.priority !== undefined) updateData.priority_c = taskData.priority;
      if (taskData.dueDate !== undefined) {
        updateData.due_date_c = taskData.dueDate ? taskData.dueDate.toISOString().split('T')[0] : null;
      }
      if (taskData.completed !== undefined) updateData.completed_c = taskData.completed;
      if (taskData.completedAt !== undefined) {
        updateData.completed_at_c = taskData.completedAt ? taskData.completedAt.toISOString() : null;
      }
      if (taskData.timeSpent !== undefined) updateData.time_spent_c = taskData.timeSpent;
      if (taskData.timerState?.isRunning !== undefined) {
        updateData.timer_state_is_running_c = taskData.timerState.isRunning;
      }
      if (taskData.timerState?.lastUpdated !== undefined) {
        updateData.timer_state_last_updated_c = taskData.timerState.lastUpdated ? taskData.timerState.lastUpdated.toISOString() : null;
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error("Error updating task:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Fetch the updated task to get full data including lookup fields
          return await this.getById(id);
        } else {
          throw new Error(result.message || "Failed to update task");
        }
      }

      throw new Error("No results returned from update operation");
    } catch (error) {
      console.error("Error in taskService.update:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);

      if (!response.success) {
        console.error("Error deleting task:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return true;
        } else {
          throw new Error(result.message || "Failed to delete task");
        }
      }

      throw new Error("No results returned from delete operation");
    } catch (error) {
      console.error("Error in taskService.delete:", error);
      throw error;
    }
  },

  async toggleComplete(id) {
    try {
      // First get the current task
      const currentTask = await this.getById(id);
      if (!currentTask) {
        throw new Error("Task not found");
      }

      // Toggle completion status
      const updatedData = {
        completed: !currentTask.completed,
        completedAt: !currentTask.completed ? new Date() : null
      };

      return await this.update(id, updatedData);
    } catch (error) {
      console.error("Error in taskService.toggleComplete:", error);
      throw error;
    }
  },

  async getByCategory(category) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "time_spent_c"}},
          {"field": {"Name": "timer_state_is_running_c"}},
          {"field": {"Name": "timer_state_last_updated_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "category_c", "operator": "ExactMatch", "values": [category]}
              ],
              "operator": ""
            }
          ]
        }],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error("Error fetching tasks by category:", response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      const tasks = (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        category: task.category_c?.Name || '',
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c ? new Date(task.due_date_c) : null,
        completed: task.completed_c || false,
        completedAt: task.completed_at_c ? new Date(task.completed_at_c) : null,
        timeSpent: task.time_spent_c || 0,
        createdAt: task.CreatedOn ? new Date(task.CreatedOn) : new Date(),
        timerState: {
          isRunning: task.timer_state_is_running_c || false,
          lastUpdated: task.timer_state_last_updated_c ? new Date(task.timer_state_last_updated_c) : null
        }
      }));

      return tasks;
    } catch (error) {
      console.error("Error in taskService.getByCategory:", error);
      throw error;
    }
  },

  async getByStatus(completed) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "time_spent_c"}},
          {"field": {"Name": "timer_state_is_running_c"}},
          {"field": {"Name": "timer_state_last_updated_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "completed_c", "Operator": "ExactMatch", "Values": [completed]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error("Error fetching tasks by status:", response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      const tasks = (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        category: task.category_c?.Name || '',
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c ? new Date(task.due_date_c) : null,
        completed: task.completed_c || false,
        completedAt: task.completed_at_c ? new Date(task.completed_at_c) : null,
        timeSpent: task.time_spent_c || 0,
        createdAt: task.CreatedOn ? new Date(task.CreatedOn) : new Date(),
        timerState: {
          isRunning: task.timer_state_is_running_c || false,
          lastUpdated: task.timer_state_last_updated_c ? new Date(task.timer_state_last_updated_c) : null
        }
      }));

      return tasks;
    } catch (error) {
      console.error("Error in taskService.getByStatus:", error);
      throw error;
    }
  }
};