import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { departmentService } from "@/services/api/departmentService";
import { employeeService } from "@/services/api/employeeService";

const Departments = () => {
  const { onMenuClick } = useOutletContext();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [departmentsData, employeesData] = await Promise.all([
        departmentService.getAll(),
        employeeService.getAll()
      ]);
      
      setDepartments(departmentsData);
      setEmployees(employeesData);
    } catch (err) {
      setError("Failed to load departments data");
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentEmployees = (departmentName) => {
    return employees.filter(emp => emp.department === departmentName);
  };

  const getDepartmentManager = (managerId) => {
    return employees.find(emp => emp.Id === managerId);
  };

  const getDepartmentStats = () => {
    return departments.map(dept => {
      const deptEmployees = getDepartmentEmployees(dept.name);
      const manager = getDepartmentManager(dept.managerId);
      return {
        ...dept,
        employeeCount: deptEmployees.length,
        activeEmployees: deptEmployees.filter(emp => emp.status === "Active").length,
        manager: manager
      };
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const departmentStats = getDepartmentStats();

  return (
    <div className="flex flex-col h-full">
      <Header 
        onMenuClick={onMenuClick}
        title="Departments"
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <ApperIcon name="Building2" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Departments</p>
                <p className="text-xl font-bold text-slate-900">{departments.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <ApperIcon name="Users" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Employees</p>
                <p className="text-xl font-bold text-slate-900">{employees.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <ApperIcon name="UserCheck" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Active Employees</p>
                <p className="text-xl font-bold text-slate-900">
                  {employees.filter(emp => emp.status === "Active").length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Department Grid */}
        {departmentStats.length === 0 ? (
          <Empty 
            title="No departments found"
            description="Start organizing your team by creating departments"
            icon="Building2"
            actionText="Create Department"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {departmentStats.map((dept) => {
              const deptEmployees = getDepartmentEmployees(dept.name);
              
              return (
                <Card 
                  key={dept.Id} 
                  className="p-6 hover cursor-pointer"
                  onClick={() => setSelectedDepartment(dept)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <ApperIcon name="Building2" size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{dept.name}</h3>
                        <p className="text-sm text-slate-600">
                          {dept.employeeCount} employees • {dept.activeEmployees} active
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="MoreHorizontal" size={16} />
                    </Button>
                  </div>
                  
                  {dept.manager && (
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-50 rounded-lg">
                      <Avatar 
                        src={dept.manager.photo} 
                        alt={`${dept.manager.firstName} ${dept.manager.lastName}`}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {dept.manager.firstName} {dept.manager.lastName}
                        </p>
                        <p className="text-xs text-slate-500">Department Manager</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Team Members</span>
                      <span className="font-medium text-slate-900">{deptEmployees.length}</span>
                    </div>
                    
                    {deptEmployees.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {deptEmployees.slice(0, 4).map((employee) => (
                            <Avatar
                              key={employee.Id}
                              src={employee.photo}
                              alt={`${employee.firstName} ${employee.lastName}`}
                              size="sm"
                              className="ring-2 ring-white"
                            />
                          ))}
                          {deptEmployees.length > 4 && (
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 ring-2 ring-white">
                              +{deptEmployees.length - 4}
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs">
                          View All
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Add Department Button */}
        <div className="flex justify-center">
          <Button variant="primary" size="lg">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add New Department
          </Button>
        </div>

        {/* Department Detail Modal/Panel would go here */}
        {selectedDepartment && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedDepartment(null)}
          >
            <Card 
              className="max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedDepartment.name} Department
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedDepartment(null)}
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {selectedDepartment.manager && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Manager</h3>
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <Avatar 
                          src={selectedDepartment.manager.photo} 
                          alt={`${selectedDepartment.manager.firstName} ${selectedDepartment.manager.lastName}`}
                        />
                        <div>
                          <p className="font-medium text-slate-900">
                            {selectedDepartment.manager.firstName} {selectedDepartment.manager.lastName}
                          </p>
                          <p className="text-sm text-slate-600">{selectedDepartment.manager.role}</p>
                          <p className="text-sm text-slate-500">{selectedDepartment.manager.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Team Members ({getDepartmentEmployees(selectedDepartment.name).length})
                    </h3>
                    <div className="space-y-3">
                      {getDepartmentEmployees(selectedDepartment.name).map((employee) => (
                        <div key={employee.Id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                          <Avatar 
                            src={employee.photo} 
                            alt={`${employee.firstName} ${employee.lastName}`}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">
                              {employee.firstName} {employee.lastName}
                            </p>
                            <p className="text-sm text-slate-600">{employee.role}</p>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              employee.status === "Active" ? "status-active text-white" :
                              employee.status === "Inactive" ? "status-inactive text-white" :
                              "status-pending text-white"
                            }`}>
                              {employee.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;