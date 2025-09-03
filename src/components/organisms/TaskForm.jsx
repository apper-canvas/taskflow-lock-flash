import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import { recurringTaskPatternService } from "@/services/api/recurringTaskPatternService";
import { recurrenceRuleService } from "@/services/api/recurrenceRuleService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Checkbox from "@/components/atoms/Checkbox";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

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
    dueDate: "",
    isRecurring: false,
    recurrence: {
      frequency: "Daily",
      interval: 1,
      dayOfWeek: "",
      dayOfMonth: "",
      weekOfMonth: "",
      endOfMonth: false,
      startDate: "",
      endDate: ""
    }
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

    // Recurring task validation
    if (formData.isRecurring) {
      if (!formData.recurrence.startDate) {
        newErrors.recurrenceStartDate = "Start date is required for recurring tasks";
      }

      if (formData.recurrence.startDate) {
        const startDate = new Date(formData.recurrence.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (startDate < today) {
          newErrors.recurrenceStartDate = "Start date cannot be in the past";
        }
      }

      if (formData.recurrence.endDate && formData.recurrence.startDate) {
        const startDate = new Date(formData.recurrence.startDate);
        const endDate = new Date(formData.recurrence.endDate);
        
        if (endDate <= startDate) {
          newErrors.recurrenceEndDate = "End date must be after start date";
        }
      }

      if (formData.recurrence.interval < 1 || formData.recurrence.interval > 365) {
        newErrors.recurrenceInterval = "Interval must be between 1 and 365";
      }

      if (formData.recurrence.frequency === "Weekly" && !formData.recurrence.dayOfWeek) {
        newErrors.recurrenceDayOfWeek = "Day of week is required for weekly recurrence";
      }

      if (formData.recurrence.frequency === "Monthly") {
        if (!formData.recurrence.endOfMonth && !formData.recurrence.dayOfMonth && !formData.recurrence.weekOfMonth) {
          newErrors.recurrenceMonthly = "Please specify day of month, week of month, or end of month";
        }
        
        if (formData.recurrence.dayOfMonth && (formData.recurrence.dayOfMonth < 1 || formData.recurrence.dayOfMonth > 31)) {
          newErrors.recurrenceDayOfMonth = "Day of month must be between 1 and 31";
        }
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

      let createdTask;
      
      if (formData.isRecurring) {
        // Create recurring task pattern first
        const patternData = {
          name: `${formData.recurrence.frequency} - ${formData.title}`,
          frequency: formData.recurrence.frequency,
          interval: parseInt(formData.recurrence.interval),
          dayOfWeek: formData.recurrence.dayOfWeek || null,
          dayOfMonth: formData.recurrence.dayOfMonth ? parseInt(formData.recurrence.dayOfMonth) : null,
          weekOfMonth: formData.recurrence.weekOfMonth || null,
          endOfMonth: formData.recurrence.endOfMonth || false
        };

        const pattern = await recurringTaskPatternService.create(patternData);
        
        // Create the task
        createdTask = await taskService.create(taskData);
        
        // Create recurrence rule linking task and pattern
        const ruleData = {
          name: `Rule for ${formData.title}`,
          taskId: createdTask.Id,
          patternId: pattern.Id,
          startDate: new Date(formData.recurrence.startDate),
          endDate: formData.recurrence.endDate ? new Date(formData.recurrence.endDate) : null
        };

        await recurrenceRuleService.create(ruleData);
        
        toast.success("Recurring task created successfully!");
      } else {
        createdTask = await taskService.create(taskData);
        toast.success("Task created successfully!");
      }

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

  const handleRecurrenceChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      recurrence: { ...prev.recurrence, [field]: value }
    }));
    
    // Clear recurrence errors when user changes values
    const errorKey = `recurrence${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }));
    }
  };

  const handleRecurringToggle = (e) => {
    const isRecurring = e.target.checked;
    setFormData(prev => ({ ...prev, isRecurring }));
    
    // Clear recurring-related errors when toggling off
    if (!isRecurring) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.recurrenceStartDate;
        delete newErrors.recurrenceEndDate;
        delete newErrors.recurrenceInterval;
        delete newErrors.recurrenceDayOfWeek;
        delete newErrors.recurrenceMonthly;
        delete newErrors.recurrenceDayOfMonth;
        return newErrors;
      });
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

      {/* Recurring Task Section */}
      <div className="border-t pt-6">
        <FormField>
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={formData.isRecurring}
              onChange={handleRecurringToggle}
            />
            <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <ApperIcon name="Repeat" size={16} />
              <span>Make this a recurring task</span>
            </label>
          </div>
        </FormField>

        {formData.isRecurring && (
          <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <ApperIcon name="Settings" size={16} />
              <span>Recurrence Pattern</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Frequency" 
                required
                error={errors.recurrenceFrequency}
              >
                <Select
                  value={formData.recurrence.frequency}
                  onChange={handleRecurrenceChange("frequency")}
                  error={errors.recurrenceFrequency}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </Select>
              </FormField>

              <FormField 
                label="Every" 
                required
                error={errors.recurrenceInterval}
              >
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={formData.recurrence.interval}
                    onChange={handleRecurrenceChange("interval")}
                    error={errors.recurrenceInterval}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">
                    {formData.recurrence.frequency.toLowerCase()}(s)
                  </span>
                </div>
              </FormField>
            </div>

            {/* Weekly Options */}
            {formData.recurrence.frequency === "Weekly" && (
              <FormField 
                label="Day of Week" 
                required
                error={errors.recurrenceDayOfWeek}
              >
                <Select
                  value={formData.recurrence.dayOfWeek}
                  onChange={handleRecurrenceChange("dayOfWeek")}
                  error={errors.recurrenceDayOfWeek}
                >
                  <option value="">Select day</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </Select>
              </FormField>
            )}

            {/* Monthly Options */}
            {formData.recurrence.frequency === "Monthly" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Choose one of the following options:</p>
                
                <FormField 
                  label="Day of Month (1-31)" 
                  error={errors.recurrenceDayOfMonth}
                >
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.recurrence.dayOfMonth}
                    onChange={handleRecurrenceChange("dayOfMonth")}
                    error={errors.recurrenceDayOfMonth}
                    placeholder="e.g., 15"
                  />
                </FormField>

                <div className="text-sm text-gray-500 text-center">OR</div>

                <FormField 
                  label="Week of Month" 
                  error={errors.recurrenceWeekOfMonth}
                >
                  <Select
                    value={formData.recurrence.weekOfMonth}
                    onChange={handleRecurrenceChange("weekOfMonth")}
                    error={errors.recurrenceWeekOfMonth}
                  >
                    <option value="">Select week</option>
                    <option value="First">First week</option>
                    <option value="Second">Second week</option>
                    <option value="Third">Third week</option>
                    <option value="Fourth">Fourth week</option>
                    <option value="Last">Last week</option>
                  </Select>
                </FormField>

                <div className="text-sm text-gray-500 text-center">OR</div>

                <FormField>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={formData.recurrence.endOfMonth}
                      onChange={handleRecurrenceChange("endOfMonth")}
                    />
                    <label className="text-sm text-gray-700">
                      Last day of month
                    </label>
                  </div>
                </FormField>

                {errors.recurrenceMonthly && (
                  <p className="text-sm text-error-600 font-medium">{errors.recurrenceMonthly}</p>
                )}
              </div>
            )}

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <FormField 
                label="Start Date" 
                required
                error={errors.recurrenceStartDate}
              >
                <Input
                  type="date"
                  value={formData.recurrence.startDate}
                  onChange={handleRecurrenceChange("startDate")}
                  min={minDate}
                  error={errors.recurrenceStartDate}
                />
              </FormField>

              <FormField 
                label="End Date (Optional)" 
                error={errors.recurrenceEndDate}
              >
                <Input
                  type="date"
                  value={formData.recurrence.endDate}
                  onChange={handleRecurrenceChange("endDate")}
                  min={formData.recurrence.startDate || minDate}
                  error={errors.recurrenceEndDate}
                />
              </FormField>
            </div>
</div>
        )}
      </div>

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