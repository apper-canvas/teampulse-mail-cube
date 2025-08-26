import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className,
  ...props 
}) => {
  return (
    <div className={cn("relative", className)} {...props}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={16} className="text-slate-400" />
      </div>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 pr-4"
      />
    </div>
  );
};

export default SearchBar;