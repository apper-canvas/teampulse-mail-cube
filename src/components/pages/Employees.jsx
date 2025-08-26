import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import EmployeeCard from "@/components/molecules/EmployeeCard";
import FilterBar from "@/components/molecules/FilterBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { employeeService } from "@/services/api/employeeService";
import { departmentService } from "@/services/api/departmentService";

const Employees = () => {
  const { onMenuClick } = useOutletContext();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [employeesData, departmentsData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll()
      ]);
      
      setEmployees(employeesData);
      setDepartments(departmentsData);
    } catch (err) {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = `${employee.firstName} ${employee.lastName}`.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
    const matchesStatus = !statusFilter || employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearFilters = () => {
    setDepartmentFilter("");
    setStatusFilter("");
    setSearchTerm("");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="flex flex-col h-full">
      <Header 
        onMenuClick={onMenuClick}
        title="Employees"
        showSearch={true}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <FilterBar
              departmentFilter={departmentFilter}
              setDepartmentFilter={setDepartmentFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onClearFilters={handleClearFilters}
              departments={departments}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
              <Button
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <ApperIcon name="Grid3X3" size={16} />
              </Button>
              <Button
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <ApperIcon name="List" size={16} />
              </Button>
            </div>
            
            <Button variant="primary">
              <ApperIcon name="UserPlus" size={16} className="mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Employee Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {filteredEmployees.length} of {employees.length} employees
          </p>
        </div>

        {/* Employee Grid/List */}
        {filteredEmployees.length === 0 ? (
          <Empty 
            title="No employees found"
            description="No employees match your current search and filter criteria"
            icon="Users"
            actionText="Add New Employee"
          />
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredEmployees.map(employee => (
              <EmployeeCard key={employee.Id} employee={employee} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;