import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const PriorityBadge = ({ priority, size = "sm" }) => {
  const priorities = {
    high: {
      label: "High",
      color: "bg-gradient-to-r from-error-500 to-error-600",
      textColor: "text-white",
      icon: "AlertTriangle"
    },
    medium: {
      label: "Medium",
      color: "bg-gradient-to-r from-warning-500 to-warning-600",
      textColor: "text-white",
      icon: "Clock"
    },
    low: {
      label: "Low",
      color: "bg-gradient-to-r from-gray-400 to-gray-500",
      textColor: "text-white",
      icon: "Minus"
    }
  };

  const config = priorities[priority];
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm"
  };

  return (
    <span className={cn(
      "inline-flex items-center space-x-1 rounded-full font-semibold",
      config.color,
      config.textColor,
      sizes[size],
      priority === "high" && "animate-pulse-success"
    )}>
      <ApperIcon name={config.icon} size={size === "sm" ? 12 : 14} />
      <span>{config.label}</span>
    </span>
  );
};

export default PriorityBadge;