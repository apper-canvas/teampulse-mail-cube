import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { attendanceService } from "@/services/api/attendanceService";
import { employeeService } from "@/services/api/employeeService";
import { eachDayOfInterval, endOfWeek, format, startOfWeek, subDays } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Employees from "@/components/pages/Employees";
import Header from "@/components/organisms/Header";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

const Attendance = () => {
  const { onMenuClick } = useOutletContext();
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [viewMode, setViewMode] = useState("daily");
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
const [attendanceData, employeesData] = await Promise.all([
        attendanceService.getAll(),
        employeeService.getAll()
      ]);
      
      setAttendance(attendanceData);
      setEmployees(employeesData);
    } catch (err) {
      setError("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const getDailyAttendance = () => {
return attendance.filter(record => record.date_c === selectedDate);
  };

  const getWeeklyAttendance = () => {
    const weekStart = startOfWeek(selectedWeek);
    const weekEnd = endOfWeek(selectedWeek);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return weekDays.map(day => {
      const dateStr = format(day, "yyyy-MM-dd");
const dayAttendance = attendance.filter(record => record.date_c === dateStr);
      return {
        date: dateStr,
        day: format(day, "EEE"),
        records: dayAttendance
      };
    });
  };

  const getAttendanceStats = () => {
    const totalEmployees = employees.length;
const presentToday = getDailyAttendance().filter(record => record.status_c === "Present").length;
    const absentToday = totalEmployees - presentToday;
const lateToday = getDailyAttendance().filter(record => record.status_c === "Late").length;

    return {
      present: presentToday,
      absent: absentToday,
      late: lateToday,
      total: totalEmployees
    };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const stats = getAttendanceStats();
  const dailyRecords = getDailyAttendance();
  const weeklyData = getWeeklyAttendance();

  return (
    <div className="flex flex-col h-full">
      <Header 
        onMenuClick={onMenuClick}
        title="Attendance Management"
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg status-approved flex items-center justify-center">
                <ApperIcon name="UserCheck" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Present Today</p>
                <p className="text-xl font-bold text-slate-900">{stats.present}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg status-inactive flex items-center justify-center">
                <ApperIcon name="UserX" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Absent Today</p>
                <p className="text-xl font-bold text-slate-900">{stats.absent}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg status-pending flex items-center justify-center">
                <ApperIcon name="Clock" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Late Today</p>
                <p className="text-xl font-bold text-slate-900">{stats.late}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <ApperIcon name="Users" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Employees</p>
                <p className="text-xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
              <Button
                variant={viewMode === "daily" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("daily")}
              >
                Daily
              </Button>
              <Button
                variant={viewMode === "weekly" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("weekly")}
              >
                Weekly
              </Button>
            </div>
            
            {viewMode === "daily" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="secondary">
              <ApperIcon name="Download" size={16} className="mr-2" />
              Export
            </Button>
            
            <Button variant="primary">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Mark Attendance
            </Button>
          </div>
        </div>

        {/* Content */}
        {viewMode === "daily" ? (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Daily Attendance - {format(new Date(selectedDate), "MMMM dd, yyyy")}
              </h3>
              <div className="text-sm text-slate-600">
                {dailyRecords.length} of {employees.length} employees recorded
              </div>
            </div>
            
            {dailyRecords.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="Clock" size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No attendance records for this date</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Check In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Check Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {dailyRecords.map((record) => {
const employee = employees.find(emp => emp.Id === record.employee_id_c?.Id || record.employee_id_c);
const checkInTime = record.check_in_c ? new Date(`2000-01-01 ${record.check_in_c}`) : null;
                      const checkOutTime = record.check_out_c ? new Date(`2000-01-01 ${record.check_out_c}`) : null;
                      const hours = checkInTime && checkOutTime 
                        ? ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(1)
                        : "-";

                      return (
                        <tr key={record.Id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <Avatar 
src={employee?.photo_c} 
                                alt={employee?.first_name_c + " " + employee?.last_name_c}
                                size="sm"
                              />
                              <div>
                                <p className="text-sm font-medium text-slate-900">
{employee?.first_name_c} {employee?.last_name_c}
                                </p>
                                <p className="text-xs text-slate-500">{employee?.role_c}</p>
                                <p className="text-sm text-slate-500">{employee?.role}</p>
                              </div>
                            </div>
                          </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {record.check_in_c || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {record.check_out_c || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {hours}h
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={
                              record.status_c === "Present" ? "success" :
                              record.status_c === "Late" ? "warning" : "danger"
                            }>
                              {record.status_c}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        ) : (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Weekly Attendance
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedWeek(subDays(selectedWeek, 7))}
                >
                  <ApperIcon name="ChevronLeft" size={16} />
                </Button>
                <span className="text-sm text-slate-600 px-4">
                  {format(startOfWeek(selectedWeek), "MMM dd")} - {format(endOfWeek(selectedWeek), "MMM dd, yyyy")}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
                >
                  <ApperIcon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Employee
                    </th>
                    {weeklyData.map(day => (
                      <th key={day.date} className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">
                        <div>{day.day}</div>
                        <div>{format(new Date(day.date), "dd")}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {employees.slice(0, 10).map((employee) => (
<tr key={employee.Id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Avatar 
src={employee.photo_c} 
                            alt={`${employee.first_name_c} ${employee.last_name_c}`}
                            size="sm"
                          />
                          <div>
<p className="text-sm font-medium text-slate-900">
                              {employee.first_name_c} {employee.last_name_c}
                            </p>
                            <p className="text-xs text-slate-500">{employee.role_c}</p>
                          </div>
                        </div>
                      </td>
{weeklyData.map(day => {
                        const dayRecord = day.records.find(record => 
                          record.employee_id_c?.Id === employee.Id || record.employee_id_c === employee.Id
                        );
                        return (
                          <td key={day.date} className="px-4 py-4 text-center">
                            {dayRecord ? (
<Badge 
                                variant={
                                  dayRecord?.status_c === "Present" ? "success" :
                                  dayRecord?.status_c === "Late" ? "warning" : "danger"
                                }
                                className="text-xs"
                              >
                                {dayRecord?.status_c === "Present" ? "P" : 
                                 dayRecord?.status_c === "Late" ? "L" : "A"}
                              </Badge>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Attendance;