import React from "react";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ 
  departmentFilter, 
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  onClearFilters,
  departments = []
}) => {
  const hasFilters = departmentFilter || statusFilter;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Select 
value={departmentFilter} 
        onChange={(e) => setDepartmentFilter(e.target.value)}
        className="w-48"
      >
        <option value="">All Departments</option>
        {departments.map(dept => (
          <option key={dept.Id} value={dept.Name}>
            {dept.Name}
          </option>
        ))}
      </Select>
      
      <Select 
        value={statusFilter} 
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-40"
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="On Leave">On Leave</option>
      </Select>
      
      {hasFilters && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClearFilters}
        >
          <ApperIcon name="X" size={14} className="mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default FilterBar;