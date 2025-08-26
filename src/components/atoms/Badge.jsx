import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  children, 
  variant = "default", 
  className, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const variants = {
    default: "bg-slate-100 text-slate-800",
    primary: "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-800",
    success: "status-approved text-white",
    warning: "status-pending text-white",
    danger: "status-rejected text-white",
    secondary: "bg-slate-100 text-slate-600",
    active: "status-active text-white",
    inactive: "status-inactive text-white"
  };
  
  return (
    <span
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;