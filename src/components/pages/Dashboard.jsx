import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { employeeService } from "@/services/api/employeeService";
import { timeOffService } from "@/services/api/timeOffService";
import { attendanceService } from "@/services/api/attendanceService";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const { onMenuClick } = useOutletContext();
  const [employees, setEmployees] = useState([]);
  const [timeOffRequests, setTimeOffRequests] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [employeesData, timeOffData, attendanceData] = await Promise.all([
        employeeService.getAll(),
        timeOffService.getAll(),
        attendanceService.getAll()
      ]);
      
      setEmployees(employeesData);
      setTimeOffRequests(timeOffData);
      setAttendance(attendanceData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

const activeEmployees = employees.filter(emp => emp.status_c === "Active");
const pendingRequests = timeOffRequests.filter(req => req.status_c === "Pending");
  const todayDate = format(new Date(), "yyyy-MM-dd");
const todayAttendance = attendance.filter(att => att.date_c === todayDate);
const upcomingTimeOff = timeOffRequests
    .filter(req => req.status_c === "Approved" && new Date(req.start_date_c) > new Date())
    .sort((a, b) => new Date(a.start_date_c) - new Date(b.start_date_c))
    .slice(0, 5);

  const recentActivity = [
...timeOffRequests.slice(0, 3).map(req => ({
      type: "time-off",
      message: `${req.employee_name_c} requested time off`,
      time: "2 hours ago",
      status: req.status_c
    })),
...todayAttendance.slice(0, 2).map(att => ({
      type: "attendance",
      message: `${att.employee_name_c} checked in`,
      time: att.check_in_c,
      status: "success"
    }))
  ].slice(0, 5);

  return (
    <div className="flex flex-col h-full">
      <Header 
        onMenuClick={onMenuClick}
        title="Dashboard"
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Employees"
            value={employees.length}
            icon="Users"
            color="primary"
            trend="up"
            trendValue="+2 this month"
          />
          <StatCard
            title="Active Employees"
            value={activeEmployees.length}
            icon="UserCheck"
            color="success"
          />
          <StatCard
            title="Pending Requests"
            value={pendingRequests.length}
            icon="Clock"
            color="warning"
          />
          <StatCard
            title="Today's Attendance"
            value={`${todayAttendance.length}/${employees.length}`}
            icon="Calendar"
            color="info"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
              <Button variant="ghost" size="sm">
                <ApperIcon name="MoreHorizontal" size={16} />
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === "Pending" ? "bg-yellow-400" :
                    activity.status === "Approved" || activity.status === "success" ? "bg-green-400" :
                    "bg-red-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{activity.message}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Time Off */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Upcoming Time Off</h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {upcomingTimeOff.length > 0 ? (
                upcomingTimeOff.map((request) => (
<div key={request.Id} className="flex items-center space-x-3">
<Avatar 
                      alt={request.employee_name_c} 
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">
{request.employee_name_c}
                      </p>
                      <p className="text-xs text-slate-500">
{format(new Date(request.start_date_c), "MMM dd")} - {format(new Date(request.end_date_c), "MMM dd")}
                      </p>
                    </div>
<Badge variant="primary" className="text-xs">
                      {request.type_c}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">
                  No upcoming time off scheduled
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
<Button 
              variant="primary" 
              className="justify-start"
              onClick={() => navigate('/employees/new')}
            >
              <ApperIcon name="UserPlus" size={16} className="mr-2" />
              Add Employee
            </Button>
            <Button variant="secondary" className="justify-start">
              <ApperIcon name="Calendar" size={16} className="mr-2" />
              View Calendar
            </Button>
            <Button variant="secondary" className="justify-start">
              <ApperIcon name="FileText" size={16} className="mr-2" />
              Generate Report
            </Button>
            <Button variant="secondary" className="justify-start">
              <ApperIcon name="Settings" size={16} className="mr-2" />
              Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;