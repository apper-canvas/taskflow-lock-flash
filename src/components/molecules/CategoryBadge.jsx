import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const CategoryBadge = ({ category, size = "sm", showCount, count, active, onClick }) => {
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center space-x-2 rounded-full font-semibold transition-all duration-200 transform hover:scale-105",
        sizes[size],
        active
          ? "text-white shadow-lg"
          : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
      )}
      style={active ? { backgroundColor: category.color } : {}}
    >
      <ApperIcon name={category.icon} size={size === "sm" ? 14 : size === "md" ? 16 : 18} />
      <span>{category.name}</span>
      {showCount && (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-xs font-bold",
          active 
            ? "bg-white/20 text-white" 
            : "bg-gray-100 text-gray-600"
        )}>
          {count}
        </span>
      )}
    </button>
  );
};

export default CategoryBadge;