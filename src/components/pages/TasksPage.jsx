import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import TaskList from "@/components/organisms/TaskList";
import TaskForm from "@/components/organisms/TaskForm";
import Modal from "@/components/organisms/Modal";

const TasksPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCreateTask = () => {
    setShowCreateModal(true);
  };

  const handleTaskCreated = () => {
    setShowCreateModal(false);
    handleTaskUpdate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onCreateTask={handleCreateTask}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        refreshTrigger={refreshTrigger}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Mobile: Full width, Desktop: 1 column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CategorySidebar
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                className="sticky top-8"
              />
            </motion.div>
          </div>

          {/* Main Content - Mobile: Full width, Desktop: 3 columns */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <TaskList
                filter={activeFilter}
                categoryFilter={activeCategory}
                searchQuery={searchQuery}
                onTaskUpdate={handleTaskUpdate}
                onCreateTask={handleCreateTask}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        size="lg"
      >
        <TaskForm
          onSuccess={handleTaskCreated}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
};

export default TasksPage;