import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
        "hover:border-gray-400",
        error && "border-error-500 focus:ring-error-500 focus:border-error-500",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;