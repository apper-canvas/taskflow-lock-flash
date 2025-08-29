import React from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  value = '', 
  onChange, 
  placeholder = 'Search...', 
  className = '',
  ...props 
}) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={cn('relative', className)}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon 
          name="Search" 
          size={18} 
          className="text-gray-400" 
        />
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-12 py-3 w-full bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400"
        aria-label={placeholder}
        {...props}
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Clear search"
        >
          <ApperIcon 
            name="X" 
            size={16} 
          />
        </button>
      )}
    </div>
  );
};

export default SearchBar;