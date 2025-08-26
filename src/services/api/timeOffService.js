import timeOffData from "@/services/mockData/timeOffRequests.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const timeOffService = {
  async getAll() {
    await delay(300);
    return [...timeOffData];
  },

  async getById(id) {
    await delay(200);
    const request = timeOffData.find(req => req.Id === id);
    if (!request) {
      throw new Error("Time off request not found");
    }
    return { ...request };
  },

  async getByEmployeeId(employeeId) {
    await delay(300);
    return timeOffData.filter(req => req.employeeId === employeeId).map(req => ({ ...req }));
  },

  async create(requestData) {
    await delay(400);
    const maxId = Math.max(...timeOffData.map(req => req.Id));
    const newRequest = {
      Id: maxId + 1,
      ...requestData,
      status: "Pending",
      submittedDate: new Date().toISOString().split("T")[0]
    };
    timeOffData.push(newRequest);
    return { ...newRequest };
  },

  async updateStatus(id, status, approvedBy = null) {
    await delay(350);
    const index = timeOffData.findIndex(req => req.Id === id);
    if (index === -1) {
      throw new Error("Time off request not found");
    }
    timeOffData[index] = { 
      ...timeOffData[index], 
      status, 
      approvedBy: status !== "Pending" ? approvedBy : null 
    };
    return { ...timeOffData[index] };
  },

  async update(id, updates) {
    await delay(350);
    const index = timeOffData.findIndex(req => req.Id === id);
    if (index === -1) {
      throw new Error("Time off request not found");
    }
    timeOffData[index] = { ...timeOffData[index], ...updates };
    return { ...timeOffData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = timeOffData.findIndex(req => req.Id === id);
    if (index === -1) {
      throw new Error("Time off request not found");
    }
    const deleted = timeOffData.splice(index, 1)[0];
    return { ...deleted };
  },

  async getByStatus(status) {
    await delay(300);
    return timeOffData.filter(req => req.status === status).map(req => ({ ...req }));
  },

  async getByDateRange(startDate, endDate) {
    await delay(300);
    return timeOffData.filter(req => {
      const reqStart = new Date(req.startDate);
      const reqEnd = new Date(req.endDate);
      const rangeStart = new Date(startDate);
      const rangeEnd = new Date(endDate);
      return (reqStart >= rangeStart && reqStart <= rangeEnd) || 
             (reqEnd >= rangeStart && reqEnd <= rangeEnd);
    }).map(req => ({ ...req }));
  }
};