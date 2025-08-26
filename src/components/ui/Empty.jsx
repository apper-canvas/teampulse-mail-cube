import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing here yet", 
  icon = "Users",
  actionText = "Get Started",
  onAction 
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-6">
          <ApperIcon name={icon} size={32} className="text-slate-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {title}
        </h3>
        
        <p className="text-slate-600 mb-6">
          {description}
        </p>
        
        {onAction && (
          <Button onClick={onAction} variant="primary">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;