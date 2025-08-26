import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import TaskItem from "@/components/organisms/TaskItem";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const TaskList = ({ 
  filter = "all", 
  categoryFilter = null, 
onTaskUpdate, 
  searchQuery = "",
  onCreateTask 
}) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      
      if (onTaskUpdate) {
        onTaskUpdate();
      }

      if (updatedTask.completed) {
        toast.success("🎉 Task completed! Great job!", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.info("Task marked as active", {
          position: "top-right",
          autoClose: 1500,
        });
      }
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error toggling task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      
      if (onTaskUpdate) {
        onTaskUpdate();
      }

      toast.success("Task deleted successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };
const handleTimerUpdate = async (taskId, timeSpent, isRunning) => {
    try {
      const updatedTask = await taskService.update(taskId, {
        timeSpent,
        timerState: { isRunning, lastUpdated: new Date() }
      });
      
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));

      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (err) {
      console.error("Error updating timer:", err);
    }
  };
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Apply status filter
    if (filter === "active") {
      filtered = filtered.filter(task => !task.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter(task => task.completed);
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }

// Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => {
        // Search in title, description, and category
        const textMatches = 
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.category.toLowerCase().includes(query);
        
        // Search in due date if it exists
        let dateMatches = false;
        if (task.dueDate) {
          const dueDate = new Date(task.dueDate);
          // Format date in multiple ways for flexible searching
          const formattedDate = format(dueDate, 'yyyy-MM-dd').toLowerCase();
          const monthYear = format(dueDate, 'MMMM yyyy').toLowerCase();
          const monthDay = format(dueDate, 'MMM d').toLowerCase();
          const fullDate = format(dueDate, 'EEEE, MMMM d, yyyy').toLowerCase();
          
          dateMatches = 
            formattedDate.includes(query) ||
            monthYear.includes(query) ||
            monthDay.includes(query) ||
            fullDate.includes(query);
        }
        
        return textMatches || dateMatches;
      });
    }

    // Sort by priority and due date
    return filtered.sort((a, b) => {
      // First by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      // Then by due date (overdue first, then nearest)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;

      // Finally by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  if (loading) {
    return <Loading type="tasks" className="mt-6" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadData}
        className="mt-6"
      />
    );
  }

  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    if (searchQuery.trim()) {
      return (
        <Empty
          icon="Search"
          title="No tasks found"
          description={`No tasks match "${searchQuery}". Try adjusting your search terms.`}
          className="mt-6"
        />
      );
    }

    if (categoryFilter) {
      return (
        <Empty
          icon="Filter"
          title={`No ${filter} tasks in ${categoryFilter}`}
          description="There are no tasks in this category and filter combination."
          action={{
            label: "Create New Task",
            onClick: onCreateTask
          }}
          className="mt-6"
        />
      );
    }

    if (filter === "completed") {
      return (
        <Empty
          icon="CheckCircle2"
          title="No completed tasks yet"
          description="Complete some tasks to see them here. You've got this!"
          className="mt-6"
        />
      );
    }

    if (filter === "active") {
      return (
        <Empty
          icon="Circle"
          title="No active tasks"
          description="All caught up! Create new tasks or check your completed ones."
          action={{
            label: "Create New Task",
            onClick: onCreateTask
          }}
          className="mt-6"
        />
      );
    }

    return (
      <Empty
        title="Ready to get organized?"
        description="Create your first task and start building productive habits with TaskFlow."
        action={{
          label: "Create Your First Task",
          onClick: onCreateTask
        }}
        className="mt-6"
      />
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ApperIcon name="List" size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredTasks.length} {filter === "all" ? "Tasks" : filter === "active" ? "Active Tasks" : "Completed Tasks"}
            {categoryFilter && ` in ${categoryFilter}`}
          </h2>
        </div>
        {searchQuery && (
          <div className="text-sm text-gray-500">
            Showing results for "{searchQuery}"
          </div>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <TaskItem
                task={task}
categories={categories}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onTimerUpdate={handleTimerUpdate}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskList;