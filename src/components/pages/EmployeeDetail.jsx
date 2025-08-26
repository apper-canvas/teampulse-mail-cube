import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { employeeService } from "@/services/api/employeeService";
import { timeOffService } from "@/services/api/timeOffService";
import { attendanceService } from "@/services/api/attendanceService";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Employees from "@/components/pages/Employees";
import Attendance from "@/components/pages/Attendance";
import Header from "@/components/organisms/Header";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const EmployeeDetail = () => {
  const { onMenuClick } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [timeOffHistory, setTimeOffHistory] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    loadEmployeeData();
  }, [id]);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [employeeData, timeOffData, attendanceData] = await Promise.all([
        employeeService.getById(parseInt(id)),
        timeOffService.getByEmployeeId(parseInt(id)),
        attendanceService.getByEmployeeId(parseInt(id))
      ]);
      
      setEmployee(employeeData);
      setTimeOffHistory(timeOffData);
      setAttendanceRecords(attendanceData);
    } catch (err) {
      setError("Failed to load employee details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadEmployeeData} />;
  if (!employee) return <Error message="Employee not found" />;

  const statusVariant = {
    "Active": "active",
    "Inactive": "inactive",
    "On Leave": "warning"
  };

  const timeOffStatusVariant = {
    "Pending": "warning",
    "Approved": "success",
    "Rejected": "danger"
  };

  const tabs = [
    { id: "info", name: "Information", icon: "User" },
    { id: "timeoff", name: "Time Off", icon: "Calendar" },
    { id: "attendance", name: "Attendance", icon: "Clock" }
  ];

  return (
    <div className="flex flex-col h-full">
      <Header 
        onMenuClick={onMenuClick}
        title="Employee Details"
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/employees")}
        >
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          Back to Employees
        </Button>

        {/* Employee Header */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar 
src={employee.photo_c} 
              alt={`${employee.first_name_c} ${employee.last_name_c}`}
              size="xl"
            />
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <h1 className="text-2xl font-bold text-slate-900">
{employee.first_name_c} {employee.last_name_c}
                </h1>
<Badge variant={statusVariant[employee.status_c]}>
                  {employee.status_c}
                </Badge>
              </div>
              
<p className="text-lg text-slate-600 mt-1">{employee.role_c}</p>
<p className="text-slate-500">{employee.department_c}</p>
              
              <div className="flex flex-wrap items-center mt-3 space-x-6 text-sm text-slate-500">
                <div className="flex items-center">
                  <ApperIcon name="Mail" size={16} className="mr-2" />
<span>{employee.email_c}</span>
                </div>
<div className="flex items-center">
                  <ApperIcon name="Phone" size={16} className="mr-2" />
                  <span>{employee.phone_c}</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Calendar" size={16} className="mr-2" />
                  <span>Started {format(new Date(employee.start_date_c), "MMM dd, yyyy")}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="primary">
                <ApperIcon name="Edit" size={16} className="mr-2" />
                Edit
              </Button>
              <Button variant="ghost">
                <ApperIcon name="MessageCircle" size={16} className="mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <ApperIcon name={tab.icon} size={16} className="mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Full Name</label>
<p className="text-slate-900">{employee.first_name_c} {employee.last_name_c}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Email</label>
<p className="text-slate-900">{employee.email_c}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Phone</label>
<p className="text-slate-900">{employee.phone_c}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Status</label>
                  <div className="mt-1">
<Badge variant={statusVariant[employee.status_c]}>
                      {employee.status_c}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Work Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Position</label>
<p className="text-slate-900">{employee.role_c}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Department</label>
<p className="text-slate-900">{employee.department_c}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Start Date</label>
<p className="text-slate-900">
                    {format(new Date(employee.start_date_c), "MMMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Employee ID</label>
                  <p className="text-slate-900">EMP-{employee.Id.toString().padStart(4, "0")}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "timeoff" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Time Off History</h3>
              <Button variant="primary" size="sm">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Request Time Off
              </Button>
            </div>
            
            {timeOffHistory.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No time off requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
{timeOffHistory.map((request) => (
                  <div key={request.Id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-slate-900">{request.type_c}</h4>
                        <Badge variant={timeOffStatusVariant[request.status_c]}>
                          {request.status_c}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {format(new Date(request.start_date_c), "MMM dd, yyyy")} - {format(new Date(request.end_date_c), "MMM dd, yyyy")}
                      </p>
                      {request.reason_c && (
                        <p className="text-sm text-slate-500 mt-1">{request.reason_c}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
)}

        {activeTab === "attendance" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Attendance Records</h3>
              <Button variant="secondary" size="sm">
                <ApperIcon name="Download" size={16} className="mr-2" />
                Export
              </Button>
            </div>
            
            {attendanceRecords.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Clock" size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No attendance records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Check In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Check Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
{attendanceRecords.slice(0, 10).map((record) => (
                      <tr key={record.Id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {format(new Date(record.date_c), "MMM dd, yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {record.check_in_c || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {record.check_out_c || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={record.status_c === "Present" ? "success" : "warning"}>
                            {record.status_c}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail;