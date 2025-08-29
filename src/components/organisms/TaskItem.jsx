import React, { useState } from "react";
import { format, isPast, isToday, isTomorrow, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import TimerComponent from "@/components/molecules/TimerComponent";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import CategoryBadge from "@/components/molecules/CategoryBadge";
import Checkbox from "@/components/atoms/Checkbox";

const TaskItem = ({ task, categories, onToggleComplete, onDelete, onTimerUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const category = categories.find(cat => cat.name === task.category);
  
  const formatDueDate = (date) => {
    if (!date) return null;
    
    const taskDate = date instanceof Date ? date : parseISO(date);
    
    if (isToday(taskDate)) {
      return { text: "Today", urgent: true };
    } else if (isTomorrow(taskDate)) {
      return { text: "Tomorrow", urgent: false };
} else if (isPast(taskDate)) {
      return { text: `Overdue (${format(taskDate, "MMM d")})`, urgent: true, overdue: true };
    } else {
      return { text: format(taskDate, "MMM d, yyyy"), urgent: false };
    }
  };

  const formatTimeSpent = (seconds) => {
    if (!seconds || seconds === 0) return "No time tracked";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m tracked`;
    } else if (minutes > 0) {
      return `${minutes}m tracked`;
    } else {
      return `${seconds}s tracked`;
    }
  };
const dueDateInfo = formatDueDate(task.dueDate);
  
  return (
    <motion.div
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200",
        task.completed && "opacity-75",
        dueDateInfo?.overdue && !task.completed && "ring-2 ring-error-200 border-error-300"
      )}
      whileHover={{ scale: 1.01 }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            <div className="mt-1">
              <Checkbox
                checked={task.completed}
                onChange={() => onToggleComplete(task.Id)}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className={cn(
                  "font-semibold text-gray-900 truncate",
                  task.completed && "line-through text-gray-500"
                )}>
                  {task.title}
                </h3>
                <PriorityBadge priority={task.priority} />
              </div>

              {task.description && (
                <p className={cn(
                  "text-gray-600 text-sm mb-3 leading-relaxed",
                  task.completed && "text-gray-400",
                  !isExpanded && "line-clamp-2"
                )}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center space-x-4">
                {category && (
                  <CategoryBadge category={category} size="sm" />
                )}
                
                {dueDateInfo && (
                  <div className={cn(
                    "inline-flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full",
                    dueDateInfo.overdue 
                      ? "bg-error-100 text-error-700"
                      : dueDateInfo.urgent 
                        ? "bg-warning-100 text-warning-700"
                        : "bg-gray-100 text-gray-600"
                  )}>
                    <ApperIcon 
                      name={dueDateInfo.overdue ? "AlertCircle" : "Calendar"} 
                      size={12} 
                    />
                    <span>{dueDateInfo.text}</span>
                  </div>
                )}

                {task.completed && task.completedAt && (
                  <div className="inline-flex items-center space-x-1 text-xs text-success-600 font-medium">
                    <ApperIcon name="CheckCircle2" size={12} />
                    <span>Completed {format(task.completedAt, "MMM d")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 ml-4">
            {/* Timer Component */}
            <div className="flex flex-col items-end space-y-1">
              <TimerComponent
                taskId={task.Id}
                initialTimeSpent={task.timeSpent || 0}
                isRunning={task.timerState?.isRunning || false}
                onTimeUpdate={onTimerUpdate}
                size="sm"
              />
              <div className="text-xs text-gray-500">
                {formatTimeSpent(task.timeSpent || 0)}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {task.description && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ApperIcon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                  />
                </button>
              )}
              
              <button
                onClick={() => onDelete(task.Id)}
                className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="Trash2" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;