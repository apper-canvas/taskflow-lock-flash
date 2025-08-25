import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = React.forwardRef(({ 
  className, 
  checked,
  disabled,
  onChange,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
        {...props}
      />
      <div
        className={cn(
          "w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer flex items-center justify-center",
          checked
            ? "bg-gradient-to-r from-primary-600 to-primary-700 border-primary-600 shadow-md"
            : "bg-white border-gray-300 hover:border-primary-400",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={() => !disabled && onChange && onChange({ target: { checked: !checked } })}
      >
        {checked && (
          <ApperIcon 
            name="Check" 
            size={14} 
            className="text-white animate-bounce-in" 
          />
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;