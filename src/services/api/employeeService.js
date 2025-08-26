const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const employeeService = {
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
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "photo_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('employee_c', params);
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching employees:", error?.response?.data?.message);
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
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "photo_c" } }
        ]
      };

      const response = await apperClient.getRecordById('employee_c', id, params);
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching employee with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async create(employeeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: employeeData.Name || `${employeeData.first_name_c} ${employeeData.last_name_c}`,
            first_name_c: employeeData.first_name_c,
            last_name_c: employeeData.last_name_c,
            email_c: employeeData.email_c,
            phone_c: employeeData.phone_c,
            role_c: employeeData.role_c,
            department_c: employeeData.department_c,
            start_date_c: employeeData.start_date_c,
            status_c: employeeData.status_c || "Active",
            photo_c: employeeData.photo_c
          }
        ]
      };

      const response = await apperClient.createRecord('employee_c', params);
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create employees ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating employee:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Id: parseInt(id),
            ...updates
          }
        ]
      };

      const response = await apperClient.updateRecord('employee_c', params);
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update employees ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating employee:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }
};