import React from "react";
import { cn } from "@/utils/cn";

const Avatar = React.forwardRef(({ 
  src, 
  alt, 
  size = "default", 
  className,
  fallback,
  ...props 
}, ref) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    default: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg"
  };
  
  const initials = alt ? alt.split(" ").map(n => n[0]).join("").toUpperCase() : "U";
  
  if (src) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt || "Avatar"}
        className={cn(
          "rounded-full object-cover ring-2 ring-white shadow-sm",
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium ring-2 ring-white shadow-sm",
        sizes[size],
        className
      )}
      {...props}
    >
      {fallback || initials}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;