const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const departmentService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "manager_id_c" } },
          { field: { Name: "parent_department_c" } },
          { field: { Name: "description_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('department_c', params);
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching departments:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "manager_id_c" } },
          { field: { Name: "parent_department_c" } },
          { field: { Name: "description_c" } }
        ]
      };

      const response = await apperClient.getRecordById('department_c', id, params);
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching department with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async create(departmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: departmentData.Name || departmentData.name,
            manager_id_c: departmentData.manager_id_c ? parseInt(departmentData.manager_id_c) : null,
            parent_department_c: departmentData.parent_department_c,
            description_c: departmentData.description_c
          }
        ]
      };

      const response = await apperClient.createRecord('department_c', params);
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create departments ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating department:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }
};