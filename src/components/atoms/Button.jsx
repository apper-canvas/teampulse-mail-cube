import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  children, 
  variant = "primary", 
  size = "default", 
  className, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-sm focus:ring-primary-500 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-primary-500 hover:border-primary-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-primary-500 transform hover:scale-[1.02] active:scale-[0.98]",
    danger: "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-sm focus:ring-red-500 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
    success: "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-sm focus:ring-green-500 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    default: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg"
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;