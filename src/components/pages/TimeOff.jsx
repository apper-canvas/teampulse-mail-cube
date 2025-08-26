import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import TimeOffCard from "@/components/molecules/TimeOffCard";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { timeOffService } from "@/services/api/timeOffService";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

const TimeOff = () => {
  const { onMenuClick } = useOutletContext();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadTimeOffRequests();
  }, []);

  const loadTimeOffRequests = async () => {
    try {
      setLoading(true);
      setError("");
      
const data = await timeOffService.getAll();
      setRequests(data);
    } catch (err) {
      setError("Failed to load time off requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
try {
      await timeOffService.updateStatus(requestId, newStatus, "Admin User");
      setRequests(requests.map(req => 
        req.Id === requestId 
          ? { ...req, status_c: newStatus, approved_by_c: "Admin User" }
          : req
      ));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

const filteredRequests = requests.filter(request => {
    const matchesStatus = !statusFilter || request.status_c === statusFilter;
    return matchesStatus;
  });

  // Calendar view data
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
const approvedRequests = requests.filter(req => req.status_c === "Approved");
  
  const getDayRequests = (day) => {
    return approvedRequests.filter(req => {
      const startDate = new Date(req.start_date_c);
      const endDate = new Date(req.end_date_c);
      return day >= startDate && day <= endDate;
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTimeOffRequests} />;

  return (
    <div className="flex flex-col h-full">
      <Header 
        onMenuClick={onMenuClick}
        title="Time Off Management"
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg status-pending flex items-center justify-center">
                <ApperIcon name="Clock" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-xl font-bold text-slate-900">
{requests.filter(r => r.status_c === "Pending").length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg status-approved flex items-center justify-center">
                <ApperIcon name="Check" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Approved</p>
<p className="text-xl font-bold text-slate-900">
                  {requests.filter(r => r.status_c === "Approved").length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg status-rejected flex items-center justify-center">
                <ApperIcon name="X" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Rejected</p>
<p className="text-xl font-bold text-slate-900">
                  {requests.filter(r => r.status_c === "Rejected").length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <ApperIcon name="Calendar" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total</p>
                <p className="text-xl font-bold text-slate-900">{requests.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
              <Button
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <ApperIcon name="List" size={16} />
              </Button>
              <Button
                variant={viewMode === "calendar" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                <ApperIcon name="Calendar" size={16} />
              </Button>
            </div>
            
            <Button variant="primary">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              New Request
            </Button>
          </div>
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          <div>
            {filteredRequests.length === 0 ? (
              <Empty 
                title="No time off requests found"
                description="No requests match your current filter criteria"
                icon="Calendar"
                actionText="Create New Request"
              />
            ) : (
              <div className="space-y-4">
                {filteredRequests.map(request => (
                  <TimeOffCard
key={request.Id}
                    request={request}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  <ApperIcon name="ChevronLeft" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  <ApperIcon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-slate-600">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map(day => {
                const dayRequests = getDayRequests(day);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-[100px] p-2 border border-slate-200 rounded-lg ${
                      isToday ? "bg-primary-50 border-primary-200" : "bg-white"
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? "text-primary-700" : "text-slate-900"
                    }`}>
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                      {dayRequests.slice(0, 2).map(req => (
                        <div
key={req.Id}
                          className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded truncate"
                        >
                          {req.employee_name_c}
                        </div>
                      ))}
                      {dayRequests.length > 2 && (
                        <div className="text-xs text-slate-500">
                          +{dayRequests.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TimeOff;