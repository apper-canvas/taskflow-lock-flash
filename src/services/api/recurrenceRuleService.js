const { ApperClient } = window.ApperSDK;

export const recurrenceRuleService = {
  async getAll() {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "task_c"}, "referenceField": {"field": {"Name": "title_c"}}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "recurring_task_pattern_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('recurrence_rule_c', params);

      if (!response?.data?.length) {
        return [];
      }

      const rules = response.data.map(rule => ({
        Id: rule.Id,
        name: rule.Name || '',
        taskId: rule.task_c?.Id || null,
        taskTitle: rule.task_c?.title_c || '',
        startDate: rule.start_date_c ? new Date(rule.start_date_c) : null,
        endDate: rule.end_date_c ? new Date(rule.end_date_c) : null,
        patternId: rule.recurring_task_pattern_c?.Id || null,
        patternName: rule.recurring_task_pattern_c?.Name || '',
        createdAt: rule.CreatedOn ? new Date(rule.CreatedOn) : new Date()
      }));

      return rules;
    } catch (error) {
      console.error("Error fetching recurrence rules:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "task_c"}, "referenceField": {"field": {"Name": "title_c"}}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "recurring_task_pattern_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      const response = await apperClient.getRecordById('recurrence_rule_c', parseInt(id), params);

      if (!response?.data) {
        return null;
      }

      const rule = response.data;
      return {
        Id: rule.Id,
        name: rule.Name || '',
        taskId: rule.task_c?.Id || null,
        taskTitle: rule.task_c?.title_c || '',
        startDate: rule.start_date_c ? new Date(rule.start_date_c) : null,
        endDate: rule.end_date_c ? new Date(rule.end_date_c) : null,
        patternId: rule.recurring_task_pattern_c?.Id || null,
        patternName: rule.recurring_task_pattern_c?.Name || '',
        createdAt: rule.CreatedOn ? new Date(rule.CreatedOn) : new Date()
      };
    } catch (error) {
      console.error(`Error fetching recurrence rule ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByTaskId(taskId) {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "task_c"}, "referenceField": {"field": {"Name": "title_c"}}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "recurring_task_pattern_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "task_c", "Operator": "ExactMatch", "Values": [parseInt(taskId)]}]
      };

      const response = await apperClient.fetchRecords('recurrence_rule_c', params);

      if (!response?.data?.length) {
        return [];
      }

      const rules = response.data.map(rule => ({
        Id: rule.Id,
        name: rule.Name || '',
        taskId: rule.task_c?.Id || null,
        taskTitle: rule.task_c?.title_c || '',
        startDate: rule.start_date_c ? new Date(rule.start_date_c) : null,
        endDate: rule.end_date_c ? new Date(rule.end_date_c) : null,
        patternId: rule.recurring_task_pattern_c?.Id || null,
        patternName: rule.recurring_task_pattern_c?.Name || '',
        createdAt: rule.CreatedOn ? new Date(rule.CreatedOn) : new Date()
      }));

      return rules;
    } catch (error) {
      console.error(`Error fetching recurrence rules for task ${taskId}:`, error?.response?.data?.message || error);
      return [];
    }
  },

  async create(ruleData) {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: ruleData.name || `Recurrence Rule for Task ${ruleData.taskId}`,
          task_c: parseInt(ruleData.taskId),
          start_date_c: ruleData.startDate ? ruleData.startDate.toISOString().split('T')[0] : null,
          end_date_c: ruleData.endDate ? ruleData.endDate.toISOString().split('T')[0] : null,
          recurring_task_pattern_c: parseInt(ruleData.patternId)
        }]
      };

      const response = await apperClient.createRecord('recurrence_rule_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error("Failed to create recurrence rule:", result.message);
          throw new Error(result.message);
        }
        return result.data;
      }

      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating recurrence rule:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, ruleData) {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id)
      };

      if (ruleData.name !== undefined) updateData.Name = ruleData.name;
      if (ruleData.taskId !== undefined) updateData.task_c = parseInt(ruleData.taskId);
      if (ruleData.startDate !== undefined) {
        updateData.start_date_c = ruleData.startDate ? ruleData.startDate.toISOString().split('T')[0] : null;
      }
      if (ruleData.endDate !== undefined) {
        updateData.end_date_c = ruleData.endDate ? ruleData.endDate.toISOString().split('T')[0] : null;
      }
      if (ruleData.patternId !== undefined) updateData.recurring_task_pattern_c = parseInt(ruleData.patternId);

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('recurrence_rule_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error("Failed to update recurrence rule:", result.message);
          throw new Error(result.message);
        }
        return result.data;
      }

      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating recurrence rule:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('recurrence_rule_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting recurrence rule:", error?.response?.data?.message || error);
      throw error;
    }
  }
};