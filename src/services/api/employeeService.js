import employeesData from "@/services/mockData/employees.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const employeeService = {
  async getAll() {
    await delay(300);
    return [...employeesData];
  },

  async getById(id) {
    await delay(200);
    const employee = employeesData.find(emp => emp.Id === id);
    if (!employee) {
      throw new Error("Employee not found");
    }
    return { ...employee };
  },

  async create(employeeData) {
    await delay(400);
    const maxId = Math.max(...employeesData.map(emp => emp.Id));
    const newEmployee = {
      Id: maxId + 1,
      ...employeeData,
      status: "Active"
    };
    employeesData.push(newEmployee);
    return { ...newEmployee };
  },

  async update(id, updates) {
    await delay(350);
    const index = employeesData.findIndex(emp => emp.Id === id);
    if (index === -1) {
      throw new Error("Employee not found");
    }
    employeesData[index] = { ...employeesData[index], ...updates };
    return { ...employeesData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = employeesData.findIndex(emp => emp.Id === id);
    if (index === -1) {
      throw new Error("Employee not found");
    }
    const deleted = employeesData.splice(index, 1)[0];
    return { ...deleted };
  },

  async getByDepartment(department) {
    await delay(300);
    return employeesData.filter(emp => emp.department === department).map(emp => ({ ...emp }));
  },

  async getByStatus(status) {
    await delay(300);
    return employeesData.filter(emp => emp.status === status).map(emp => ({ ...emp }));
  }
};