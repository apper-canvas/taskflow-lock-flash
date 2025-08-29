import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import CategoryBadge from "@/components/molecules/CategoryBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

const CategorySidebar = ({ activeCategory, onCategoryChange, className }) => {
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ]);
      setCategories(categoriesData);
      setTasks(tasksData);
    } catch (err) {
      setError("Failed to load categories");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCategoryTaskCount = (categoryName) => {
    return tasks.filter(task => task.category === categoryName && !task.completed).length;
  };

  const getTotalActiveTasks = () => {
    return tasks.filter(task => !task.completed).length;
  };

  if (loading) {
    return (
      <div className={className}>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200 lg:hidden"
            >
              <ApperIcon 
                name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
                size={16} 
                className="text-gray-500" 
              />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {(!isCollapsed || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-3">
                {/* All Tasks */}
                <button
                  onClick={() => onCategoryChange(null)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                    activeCategory === null
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ApperIcon 
                        name="List" 
                        size={18} 
                        className={activeCategory === null ? "text-white" : "text-gray-600"} 
                      />
                      <span className="font-medium">All Tasks</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      activeCategory === null
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {getTotalActiveTasks()}
                    </span>
                  </div>
                </button>

                {/* Category List */}
                <div className="space-y-2">
{categories.map((category) => {
                    const taskCount = getCategoryTaskCount(category.name);
                    const isActive = activeCategory === category.name;
                    
                    return (
                      <motion.button
                        key={category.Id}
                        onClick={() => onCategoryChange(category.name)}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                          isActive
                            ? "text-white shadow-lg"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md"
                        }`}
                        style={isActive ? { 
                          background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)` 
                        } : {}}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <ApperIcon 
                              name={category.icon} 
                              size={18} 
                              className={isActive ? "text-white" : "text-gray-600"} 
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{category.name}</span>
                              {category.subCategory && (
                                <span className={`text-xs ${
                                  isActive ? "text-white/70" : "text-gray-500"
                                }`}>
                                  {category.subCategory}
                                </span>
                              )}
                            </div>
                          </div>
                          {taskCount > 0 && (
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              isActive 
                                ? "bg-white/20 text-white" 
                                : "bg-gray-200 text-gray-600"
                            }`}>
                              {taskCount}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategorySidebar;