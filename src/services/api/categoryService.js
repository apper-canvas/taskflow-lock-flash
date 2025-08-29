const tableName = 'category_c';

export const categoryService = {
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
          {"field": {"Name": "Name"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "sub_category_c"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error("Error fetching categories:", response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
const categories = (response.data || []).map(category => ({
        Id: category.Id,
        name: category.Name,
        color: category.color_c,
        icon: category.icon_c,
        subCategory: category.sub_category_c
      }));

      return categories;
    } catch (error) {
      console.error("Error in categoryService.getAll:", error);
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
          {"field": {"Name": "Name"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "sub_category_c"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);

      if (!response.success) {
        console.error("Error fetching category:", response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        return null;
      }

      // Transform data to match UI expectations
return {
        Id: response.data.Id,
        name: response.data.Name,
        color: response.data.color_c,
        icon: response.data.icon_c,
        subCategory: response.data.sub_category_c
      };
    } catch (error) {
      console.error("Error in categoryService.getById:", error);
      throw error;
    }
  },

  async create(categoryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
Name: categoryData.name,
          color_c: categoryData.color,
          icon_c: categoryData.icon,
          sub_category_c: categoryData.subCategory
        }]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        console.error("Error creating category:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return {
Id: result.data.Id,
            name: result.data.Name,
            color: result.data.color_c,
            icon: result.data.icon_c,
            subCategory: result.data.sub_category_c
          };
        } else {
          throw new Error(result.message || "Failed to create category");
        }
      }

      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error in categoryService.create:", error);
      throw error;
    }
  },

  async update(id, categoryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id)
      };

if (categoryData.name !== undefined) updateData.Name = categoryData.name;
      if (categoryData.color !== undefined) updateData.color_c = categoryData.color;
      if (categoryData.icon !== undefined) updateData.icon_c = categoryData.icon;
      if (categoryData.subCategory !== undefined) updateData.sub_category_c = categoryData.subCategory;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error("Error updating category:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return {
Id: result.data.Id,
            name: result.data.Name,
            color: result.data.color_c,
            icon: result.data.icon_c,
            subCategory: result.data.sub_category_c
          };
        } else {
          throw new Error(result.message || "Failed to update category");
        }
      }

      throw new Error("No results returned from update operation");
    } catch (error) {
      console.error("Error in categoryService.update:", error);
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
        console.error("Error deleting category:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return true;
        } else {
          throw new Error(result.message || "Failed to delete category");
        }
      }

      throw new Error("No results returned from delete operation");
    } catch (error) {
      console.error("Error in categoryService.delete:", error);
      throw error;
    }
  }
};