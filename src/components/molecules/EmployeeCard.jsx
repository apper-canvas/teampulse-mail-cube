import React from "react";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useNavigate } from "react-router-dom";

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
          size="lg"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {employee.firstName} {employee.lastName}
            </h3>
            <Badge variant={statusVariant[employee.status]}>
              {employee.status}
            </Badge>
          </div>
          
          <p className="text-sm text-slate-600 truncate">{employee.role}</p>
          <p className="text-sm text-slate-500">{employee.department}</p>
          
          <div className="flex items-center mt-2 space-x-4 text-xs text-slate-500">
            <div className="flex items-center">
              <ApperIcon name="Mail" size={12} className="mr-1" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Phone" size={12} className="mr-1" />
              <span>{employee.phone}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleViewProfile}
          >
            <ApperIcon name="Eye" size={14} className="mr-1" />
            View
          </Button>
          <Button variant="ghost" size="sm">
            <ApperIcon name="MessageCircle" size={14} className="mr-1" />
            Contact
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EmployeeCard;