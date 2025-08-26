import attendanceData from "@/services/mockData/attendance.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(300);
    return [...attendanceData];
  },

  async getById(id) {
    await delay(200);
    const record = attendanceData.find(att => att.Id === id);
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  },

  async getByEmployeeId(employeeId) {
    await delay(300);
    return attendanceData
      .filter(att => att.employeeId === employeeId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(att => ({ ...att }));
  },

  async getByDate(date) {
    await delay(300);
    return attendanceData.filter(att => att.date === date).map(att => ({ ...att }));
  },

  async getByDateRange(startDate, endDate) {
    await delay(300);
    return attendanceData.filter(att => {
      const attDate = new Date(att.date);
      const rangeStart = new Date(startDate);
      const rangeEnd = new Date(endDate);
      return attDate >= rangeStart && attDate <= rangeEnd;
    }).map(att => ({ ...att }));
  },

  async create(attendanceRecord) {
    await delay(400);
    const maxId = Math.max(...attendanceData.map(att => att.Id));
    const newRecord = {
      Id: maxId + 1,
      ...attendanceRecord
    };
    attendanceData.push(newRecord);
    return { ...newRecord };
  },

  async update(id, updates) {
    await delay(350);
    const index = attendanceData.findIndex(att => att.Id === id);
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendanceData[index] = { ...attendanceData[index], ...updates };
    return { ...attendanceData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = attendanceData.findIndex(att => att.Id === id);
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    const deleted = attendanceData.splice(index, 1)[0];
    return { ...deleted };
  },

  async markAttendance(employeeId, employeeName, checkIn, checkOut = null) {
    await delay(400);
    const today = new Date().toISOString().split("T")[0];
    
    // Check if record already exists for today
    const existingIndex = attendanceData.findIndex(
      att => att.employeeId === employeeId && att.date === today
    );
    
    if (existingIndex !== -1) {
      // Update existing record
      attendanceData[existingIndex] = {
        ...attendanceData[existingIndex],
        checkOut,
        status: this.calculateStatus(checkIn, checkOut)
      };
      return { ...attendanceData[existingIndex] };
    } else {
      // Create new record
      const maxId = Math.max(...attendanceData.map(att => att.Id));
      const newRecord = {
        Id: maxId + 1,
        employeeId,
        employeeName,
        date: today,
        checkIn,
        checkOut,
        status: this.calculateStatus(checkIn, checkOut)
      };
      attendanceData.push(newRecord);
      return { ...newRecord };
    }
  },

  calculateStatus(checkIn, checkOut) {
    if (!checkIn) return "Absent";
    
    const checkInTime = new Date(`2000-01-01 ${checkIn}`);
    const workStart = new Date("2000-01-01 09:00");
    
    if (checkInTime > workStart) {
      return "Late";
    }
    return "Present";
  }
};