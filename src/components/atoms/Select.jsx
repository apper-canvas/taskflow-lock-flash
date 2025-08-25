import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className, 
  error,
  children,
  ...props 
}, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 transition-all duration-200 appearance-none cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
        "hover:border-gray-400",
        error && "border-error-500 focus:ring-error-500 focus:border-error-500",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;