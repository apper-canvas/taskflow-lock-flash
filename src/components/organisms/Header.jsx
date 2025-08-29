import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { taskService } from "@/services/api/taskService";
import ProgressRing from "@/components/molecules/ProgressRing";
import TaskFilters from "@/components/molecules/TaskFilters";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  activeFilter, 
  onFilterChange, 
  onCreateTask, 
  searchQuery, 
  onSearchChange,
  refreshTrigger 
}) => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
active: 0,
    completionRate: 0,
    totalTimeSpent: 0,
    averageTimePerTask: 0
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const tasks = await taskService.getAll();
      const completed = tasks.filter(task => task.completed).length;
      const active = tasks.filter(task => !task.completed).length;
      const total = tasks.length;
const completionRate = total > 0 ? (completed / total) * 100 : 0;
      const totalTimeSpent = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
      const averageTimePerTask = total > 0 ? totalTimeSpent / total : 0;

      setStats({
        total,
        completed,
        active,
        completionRate,
        totalTimeSpent,
        averageTimePerTask
      });
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d");

  const taskCounts = {
    all: stats.total,
    active: stats.active,
    completed: stats.completed
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-gray-600 mt-1">{formattedDate}</p>
              </motion.div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Progress Ring */}
              {!loading && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <ProgressRing 
                    progress={stats.completionRate} 
                    size={100} 
                    strokeWidth={6} 
                  />
                </motion.div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gradient-to-br from-success-50 to-success-100 p-4 rounded-xl border border-success-200"
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="CheckCircle2" size={20} className="text-success-600" />
                    <div>
                      <p className="text-2xl font-bold text-success-700">{stats.completed}</p>
                      <p className="text-xs font-medium text-success-600">Completed</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-gradient-to-br from-warning-50 to-warning-100 p-4 rounded-xl border border-warning-200"
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Clock" size={20} className="text-warning-600" />
                    <div>
<p className="text-2xl font-bold text-warning-700">{stats.active}</p>
                      <p className="text-xs font-medium text-warning-600">Active</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-xl border border-primary-200"
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Timer" size={20} className="text-primary-600" />
                    <div>
                      <p className="text-2xl font-bold text-primary-700">
                        {Math.floor(stats.totalTimeSpent / 3600)}h
                      </p>
                      <p className="text-xs font-medium text-primary-600">Tracked</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search and Create Button */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <ApperIcon 
                  name="Search" 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full sm:w-80 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400"
                />
              </div>

              <button
                onClick={onCreateTask}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ApperIcon name="Plus" size={20} className="mr-2" />
                New Task
              </button>
            </div>

            {/* Task Filters */}
            <TaskFilters
              activeFilter={activeFilter}
              onFilterChange={onFilterChange}
              taskCounts={taskCounts}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;