import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";

const EmployeeCard = ({ employee }) => {
  const navigate = useNavigate();
  
  const statusVariant = {
    "Active": "active",
    "Inactive": "inactive",
    "On Leave": "warning"
  };

  const handleViewProfile = () => {
navigate(`/employees/${employee.Id}`);
  };

  return (
    <Card className="p-6 hover animate-fade-in">
    <div className="flex items-center space-x-4">
        <Avatar
            src={employee.photo}
            alt={`${employee.firstName} ${employee.lastName}`}
            size="lg" />
        <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-slate-900 truncate">
                    {employee.firstName} {employee.lastName}
                </h3>
                <Badge variant={statusVariant[employee.status_c]}>
                    {employee.status_c}
                    {employee.status_c}
                </Badge>
            </div>
            <p className="text-sm text-slate-600 truncate">{employee.role_c}</p>
            <p className="text-sm text-slate-600 truncate">{employee.role_c}</p>
            <p className="text-sm text-slate-500">{employee.department_c}</p>
            <p className="text-sm text-slate-500">{employee.department_c}</p>
            <div className="flex items-center mt-2 space-x-4 text-xs text-slate-500">
                <div className="flex items-center">
                    <ApperIcon name="Mail" size={12} className="mr-1" />
                    <span className="truncate">{employee.email_c}</span>
                </div>
                <div className="flex items-center">
                    <ApperIcon name="Phone" size={12} className="mr-1" />
                    <span className="truncate">{employee.phone_c}</span>
                </div>
                <span>{employee.phone}</span>
            </div>
        </div>
    </div>
    <div className="flex flex-col space-y-2">
        <Button variant="primary" size="sm" onClick={handleViewProfile}>
            <ApperIcon name="Eye" size={14} className="mr-1" />View
                      </Button>
        <Button variant="ghost" size="sm">
            <ApperIcon name="MessageCircle" size={14} className="mr-1" />Contact
                      </Button>
    </div>
</Card>
  );
};

export default EmployeeCard;