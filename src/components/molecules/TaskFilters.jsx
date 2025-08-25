import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const TaskFilters = ({ activeFilter, onFilterChange, taskCounts }) => {
  const filters = [
    { key: "all", label: "All Tasks", icon: "List", count: taskCounts.all },
    { key: "active", label: "Active", icon: "Circle", count: taskCounts.active },
    { key: "completed", label: "Completed", icon: "CheckCircle2", count: taskCounts.completed }
  ];

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={cn(
            "flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            activeFilter === filter.key
              ? "bg-white text-primary-700 shadow-md transform scale-105"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
          )}
        >
          <ApperIcon name={filter.icon} size={16} />
          <span>{filter.label}</span>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-bold",
            activeFilter === filter.key
              ? "bg-primary-100 text-primary-700"
              : "bg-gray-300 text-gray-600"
          )}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TaskFilters;