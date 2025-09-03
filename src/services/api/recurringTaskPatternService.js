const { ApperClient } = window.ApperSDK;

export const recurringTaskPatternService = {
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
          {"field": {"Name": "frequency_c"}},
          {"field": {"Name": "interval_c"}},
          {"field": {"Name": "day_of_week_c"}},
          {"field": {"Name": "day_of_month_c"}},
          {"field": {"Name": "week_of_month_c"}},
          {"field": {"Name": "end_of_month_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('recurring_task_pattern_c', params);

      if (!response?.data?.length) {
        return [];
      }

      const patterns = response.data.map(pattern => ({
        Id: pattern.Id,
        name: pattern.Name || '',
        frequency: pattern.frequency_c || 'Daily',
        interval: pattern.interval_c || 1,
        dayOfWeek: pattern.day_of_week_c || '',
        dayOfMonth: pattern.day_of_month_c || null,
        weekOfMonth: pattern.week_of_month_c || '',
        endOfMonth: pattern.end_of_month_c || false,
        createdAt: pattern.CreatedOn ? new Date(pattern.CreatedOn) : new Date()
      }));

      return patterns;
    } catch (error) {
      console.error("Error fetching recurring task patterns:", error?.response?.data?.message || error);
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
          {"field": {"Name": "frequency_c"}},
          {"field": {"Name": "interval_c"}},
          {"field": {"Name": "day_of_week_c"}},
          {"field": {"Name": "day_of_month_c"}},
          {"field": {"Name": "week_of_month_c"}},
          {"field": {"Name": "end_of_month_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      const response = await apperClient.getRecordById('recurring_task_pattern_c', parseInt(id), params);

      if (!response?.data) {
        return null;
      }

      const pattern = response.data;
      return {
        Id: pattern.Id,
        name: pattern.Name || '',
        frequency: pattern.frequency_c || 'Daily',
        interval: pattern.interval_c || 1,
        dayOfWeek: pattern.day_of_week_c || '',
        dayOfMonth: pattern.day_of_month_c || null,
        weekOfMonth: pattern.week_of_month_c || '',
        endOfMonth: pattern.end_of_month_c || false,
        createdAt: pattern.CreatedOn ? new Date(pattern.CreatedOn) : new Date()
      };
    } catch (error) {
      console.error(`Error fetching recurring task pattern ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(patternData) {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: patternData.name || `${patternData.frequency} Pattern`,
          frequency_c: patternData.frequency || 'Daily',
          interval_c: patternData.interval || 1,
          day_of_week_c: patternData.dayOfWeek || null,
          day_of_month_c: patternData.dayOfMonth || null,
          week_of_month_c: patternData.weekOfMonth || null,
          end_of_month_c: patternData.endOfMonth || false
        }]
      };

      const response = await apperClient.createRecord('recurring_task_pattern_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error("Failed to create recurring task pattern:", result.message);
          throw new Error(result.message);
        }
        return result.data;
      }

      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating recurring task pattern:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, patternData) {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id)
      };

      if (patternData.name !== undefined) updateData.Name = patternData.name;
      if (patternData.frequency !== undefined) updateData.frequency_c = patternData.frequency;
      if (patternData.interval !== undefined) updateData.interval_c = patternData.interval;
      if (patternData.dayOfWeek !== undefined) updateData.day_of_week_c = patternData.dayOfWeek;
      if (patternData.dayOfMonth !== undefined) updateData.day_of_month_c = patternData.dayOfMonth;
      if (patternData.weekOfMonth !== undefined) updateData.week_of_month_c = patternData.weekOfMonth;
      if (patternData.endOfMonth !== undefined) updateData.end_of_month_c = patternData.endOfMonth;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('recurring_task_pattern_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error("Failed to update recurring task pattern:", result.message);
          throw new Error(result.message);
        }
        return result.data;
      }

      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating recurring task pattern:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('recurring_task_pattern_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting recurring task pattern:", error?.response?.data?.message || error);
      throw error;
    }
  }
};