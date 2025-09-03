import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

const TaskForm = ({ onSuccess, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    priority: "medium",
    dueDate: ""
  });

  const [errors, setErrors] = useState({});

  const loadCategories = async () => {
    try {
      setError("");
      setLoading(true);
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setFormData(prev => ({ ...prev, category: categoriesData[0].name }));
      }
    } catch (err) {
      setError("Failed to load categories. Please try again.");
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null
      };

      await taskService.create(taskData);
      
      toast.success("🎉 Task created successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toast.error("Failed to create task. Please try again.");
      console.error("Error creating task:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (loading) {
    return <Loading className="p-8" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadCategories}
        className="p-8"
      />
    );
  }

  // Get tomorrow's date as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = format(tomorrow, "yyyy-MM-dd");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-xl border border-primary-200">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
            <ApperIcon name="Plus" size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-primary-900">Create New Task</h3>
        </div>
        <p className="text-primary-700 text-sm">
          Add a new task to keep yourself organized and productive.
        </p>
      </div>

      <FormField 
        label="Task Title" 
        required 
        error={errors.title}
      >
        <Input
          type="text"
          placeholder="What needs to be done?"
          value={formData.title}
          onChange={handleInputChange("title")}
          error={errors.title}
        />
      </FormField>

      <FormField 
        label="Description" 
        error={errors.description}
      >
        <Textarea
          placeholder="Add more details about this task..."
          value={formData.description}
          onChange={handleInputChange("description")}
          error={errors.description}
          rows={3}
        />
        <div className="text-xs text-gray-500 mt-1">
          {formData.description.length}/500 characters
        </div>
      </FormField>

<FormField 
        label="Category" 
        required 
        error={errors.category}
      >
        <Select
          value={formData.category}
          onChange={handleInputChange("category")}
          error={errors.category}
        >
          {categories.map((category) => (
            <option key={category.Id} value={category.name}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField 
        label="Subcategory (Optional)"
        error={errors.subCategory}
      >
        <Input
          type="text"
          placeholder="Enter subcategory..."
          value={formData.subCategory}
          onChange={handleInputChange("subCategory")}
          error={errors.subCategory}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Priority">
          <Select
            value={formData.priority}
            onChange={handleInputChange("priority")}
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </Select>
        </FormField>
      </div>

      <FormField 
        label="Due Date (Optional)" 
        error={errors.dueDate}
      >
        <Input
          type="date"
          value={formData.dueDate}
          onChange={handleInputChange("dueDate")}
          min={minDate}
          error={errors.dueDate}
        />
      </FormField>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting || !formData.title.trim()}
        >
          {submitting ? (
            <>
              <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create Task
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;