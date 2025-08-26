import departmentsData from "@/services/mockData/departments.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const departmentService = {
  async getAll() {
    await delay(300);
    return [...departmentsData];
  },

  async getById(id) {
    await delay(200);
    const department = departmentsData.find(dept => dept.Id === id);
    if (!department) {
      throw new Error("Department not found");
    }
    return { ...department };
  },

  async create(departmentData) {
    await delay(400);
    const maxId = Math.max(...departmentsData.map(dept => dept.Id));
    const newDepartment = {
      Id: maxId + 1,
      ...departmentData
    };
    departmentsData.push(newDepartment);
    return { ...newDepartment };
  },

  async update(id, updates) {
    await delay(350);
    const index = departmentsData.findIndex(dept => dept.Id === id);
    if (index === -1) {
      throw new Error("Department not found");
    }
    departmentsData[index] = { ...departmentsData[index], ...updates };
    return { ...departmentsData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = departmentsData.findIndex(dept => dept.Id === id);
    if (index === -1) {
      throw new Error("Department not found");
    }
    const deleted = departmentsData.splice(index, 1)[0];
    return { ...deleted };
  },

  async getByManager(managerId) {
    await delay(300);
    return departmentsData.filter(dept => dept.managerId === managerId).map(dept => ({ ...dept }));
  },

  async getRootDepartments() {
    await delay(300);
    return departmentsData.filter(dept => !dept.parentDepartment).map(dept => ({ ...dept }));
  },

  async getSubDepartments(parentId) {
    await delay(300);
    const parentDept = departmentsData.find(dept => dept.Id === parentId);
    if (!parentDept) {
      throw new Error("Parent department not found");
    }
    return departmentsData.filter(dept => dept.parentDepartment === parentDept.name).map(dept => ({ ...dept }));
  }
};