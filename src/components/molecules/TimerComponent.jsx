import { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TimerComponent = ({ 
  taskId, 
  initialTimeSpent = 0, 
  isRunning = false, 
  onTimeUpdate, 
  size = 'md',
  className 
}) => {
  const [timeSpent, setTimeSpent] = useState(initialTimeSpent);
  const [timerRunning, setTimerRunning] = useState(isRunning);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimeSpent(prev => {
          const newTime = prev + 1;
          if (onTimeUpdate) {
            onTimeUpdate(taskId, newTime, true);
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerRunning, taskId, onTimeUpdate]);

  useEffect(() => {
    setTimeSpent(initialTimeSpent);
  }, [initialTimeSpent]);

  useEffect(() => {
    setTimerRunning(isRunning);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleTimer = () => {
    const newRunning = !timerRunning;
    setTimerRunning(newRunning);
    if (onTimeUpdate) {
      onTimeUpdate(taskId, timeSpent, newRunning);
    }
  };

  const sizeClasses = {
    sm: {
      button: 'p-1.5',
      icon: 12,
      text: 'text-xs'
    },
    md: {
      button: 'p-2',
      icon: 14,
      text: 'text-sm'
    },
    lg: {
      button: 'p-2.5',
      icon: 16,
      text: 'text-base'
    }
  };

  const sizeConfig = sizeClasses[size];

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn(
        "font-mono font-medium",
        sizeConfig.text,
        timerRunning ? "text-primary-600" : "text-gray-600"
      )}>
        {formatTime(timeSpent)}
      </div>
      
      <button
        onClick={handleToggleTimer}
        className={cn(
          "rounded-lg transition-all duration-200 transform hover:scale-105",
          sizeConfig.button,
          timerRunning 
            ? "bg-error-100 text-error-600 hover:bg-error-200" 
            : "bg-success-100 text-success-600 hover:bg-success-200"
        )}
        title={timerRunning ? "Stop Timer" : "Start Timer"}
      >
        <ApperIcon 
          name={timerRunning ? "Square" : "Play"} 
          size={sizeConfig.icon} 
        />
      </button>
      
      {timerRunning && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
          <span className={cn("text-success-600 font-medium", sizeConfig.text)}>
            Running
          </span>
        </div>
      )}
    </div>
  );
};

export default TimerComponent;