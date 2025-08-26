import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { toast } from "react-toastify";

const TimeOffCard = ({ request, onStatusChange }) => {
  const statusVariant = {
    "Pending": "warning",
    "Approved": "success",
    "Rejected": "danger"
  };

  const handleApprove = () => {
onStatusChange(request.Id, "Approved");
    toast.success(`Time off request approved for ${request.employee_name_c}`);
  };

  const handleReject = () => {
onStatusChange(request.Id, "Rejected");
    toast.error(`Time off request rejected for ${request.employee_name_c}`);
  };

  return (
    <Card className="p-6 hover animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
<h3 className="font-semibold text-slate-900">
              {request.employee_name_c}
            </h3>
            <Badge variant={statusVariant[request.status_c]}>
              {request.status_c}
            </Badge>
          </div>
          
          <div className="space-y-1 text-sm text-slate-600">
            <div className="flex items-center">
              <ApperIcon name="Calendar" size={14} className="mr-2" />
<span>
                {format(new Date(request.start_date_c), "MMM dd, yyyy")} - {format(new Date(request.end_date_c), "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Tag" size={14} className="mr-2" />
<span>{request.type_c}</span>
            </div>
{request.reason_c && (
              <div className="flex items-start">
                <ApperIcon name="MessageSquare" size={14} className="mr-2 mt-0.5" />
                <span>{request.reason_c}</span>
              </div>
            )}
          </div>
        </div>
        
{request.status_c === "Pending" && (
          <div className="flex space-x-2">
            <Button 
              variant="success" 
              size="sm"
              onClick={handleApprove}
            >
              <ApperIcon name="Check" size={14} className="mr-1" />
              Approve
            </Button>
            <Button 
              variant="danger" 
              size="sm"
              onClick={handleReject}
            >
              <ApperIcon name="X" size={14} className="mr-1" />
              Reject
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TimeOffCard;