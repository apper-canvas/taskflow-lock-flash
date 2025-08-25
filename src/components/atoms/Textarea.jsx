import React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef(({ 
  className, 
  error,
  rows = 3,
  ...props 
}, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 resize-none",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
        "hover:border-gray-400",
        error && "border-error-500 focus:ring-error-500 focus:border-error-500",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;