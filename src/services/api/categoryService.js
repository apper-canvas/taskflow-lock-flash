import mockCategories from "@/services/mockData/categories.json";

let categories = [...mockCategories];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));

export const categoryService = {
  async getAll() {
    await delay();
    return [...categories];
  },

  async getById(id) {
    await delay();
    return categories.find(category => category.Id === parseInt(id));
  },

  async create(categoryData) {
    await delay();
    const newCategory = {
      ...categoryData,
      Id: Math.max(...categories.map(c => c.Id), 0) + 1
    };
    categories.push(newCategory);
    return {...newCategory};
  },

  async update(id, categoryData) {
    await delay();
    const index = categories.findIndex(category => category.Id === parseInt(id));
    if (index !== -1) {
      categories[index] = { ...categories[index], ...categoryData };
      return {...categories[index]};
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = categories.findIndex(category => category.Id === parseInt(id));
    if (index !== -1) {
      const deletedCategory = categories[index];
      categories.splice(index, 1);
      return {...deletedCategory};
    }
    return null;
  }
};