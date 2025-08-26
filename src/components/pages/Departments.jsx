import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Input from "@/components/atoms/Input";
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    managerId: ""
  });
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

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Department name is required");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Department description is required");
      return;
    }

    try {
      setAddLoading(true);
      
      const newDepartment = {
Name: formData.name.trim(),
        description_c: formData.description.trim(),
        manager_id_c: formData.managerId ? parseInt(formData.managerId) : null,
        parent_department_c: null
      };
      
      await departmentService.create(newDepartment);
      
      toast.success("Department created successfully!");
      setShowAddModal(false);
      setFormData({ name: "", description: "", managerId: "" });
      
      // Reload data to show new department
      await loadData();
      
    } catch (err) {
      toast.error("Failed to create department. Please try again.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({ name: "", description: "", managerId: "" });
  };

  const getDepartmentEmployees = (departmentName) => {
return employees.filter(emp => emp.department_c === departmentName);
  };

  const getDepartmentManager = (managerId) => {
return employees.find(emp => emp.Id === (managerId?.Id || managerId));
  };

  const getDepartmentStats = () => {
    return departments.map(dept => {
      const deptEmployees = getDepartmentEmployees(dept.name);
      const manager = getDepartmentManager(dept.managerId);
return {
        ...dept,
        employeeCount: deptEmployees.length,
        activeEmployees: deptEmployees.filter(emp => emp.status_c === "Active").length,
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
{employees.filter(emp => emp.status_c === "Active").length}
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
                        src={dept.manager?.photo_c} 
                        alt={`${dept.manager?.first_name_c} ${dept.manager?.last_name_c}`}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {dept.manager?.first_name_c} {dept.manager?.last_name_c}
                        </p>
                        <p className="text-xs text-slate-500">{dept.manager?.role_c}</p>
                      </div>
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
                              src={employee.photo_c}
                              alt={`${employee.first_name_c} ${employee.last_name_c}`}
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
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => setShowAddModal(true)}
          >
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
{selectedDepartment.Name} Department
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
{getDepartmentEmployees(selectedDepartment.Name).map((employee) => (
                        <div key={employee.Id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                          <Avatar 
                            src={employee.photo_c} 
                            alt={`${employee.first_name_c} ${employee.last_name_c}`}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">
                              {employee.first_name_c} {employee.last_name_c}
                            </p>
                            <p className="text-sm text-slate-600">{employee.role_c}</p>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              employee.status_c === "Active" ? "status-active text-white" :
                              employee.status_c === "Inactive" ? "status-inactive text-white" :
                              "status-pending text-white"
                            }`}>
                              {employee.status_c}
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

        {/* Add Department Modal */}
        {showAddModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <Card 
              className="max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Add New Department
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleCloseModal}
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>
                
                <form onSubmit={handleAddDepartment} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                      Department Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter department name"
                      disabled={addLoading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                      Description *
                    </label>
                    <Input
                      id="description"
                      type="text"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter department description"
                      disabled={addLoading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="manager" className="block text-sm font-medium text-slate-700 mb-1">
                      Department Manager (Optional)
                    </label>
                    <select
                      id="manager"
                      value={formData.managerId}
                      onChange={(e) => handleInputChange('managerId', e.target.value)}
                      disabled={addLoading}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a manager</option>
                      {employees.map((employee) => (
<option key={employee.Id} value={employee.Id}>
                          {employee.first_name_c} {employee.last_name_c} - {employee.role_c}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      size="default"
                      onClick={handleCloseModal}
                      disabled={addLoading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="default"
                      disabled={addLoading}
                      className="flex-1"
                    >
                      {addLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Plus" size={16} className="mr-2" />
                          Create Department
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;