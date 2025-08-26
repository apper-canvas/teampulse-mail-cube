const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const timeOffService = {
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
          { field: { Name: "employee_name_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "employee_id_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('time_off_request_c', params);
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching time off requests:", error?.response?.data?.message);
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
          { field: { Name: "employee_name_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "employee_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById('time_off_request_c', id, params);
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching time off request with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async getByEmployeeId(employeeId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_name_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "employee_id_c" } }
        ],
        where: [
          {
            FieldName: "employee_id_c",
            Operator: "EqualTo",
            Values: [employeeId]
          }
        ]
      };

      const response = await apperClient.fetchRecords('time_off_request_c', params);
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching time off requests by employee:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async updateStatus(id, status, approvedBy = null) {
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
            status_c: status,
            approved_by_c: status !== "Pending" ? approvedBy : null
          }
        ]
      };

      const response = await apperClient.updateRecord('time_off_request_c', params);
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update time off status ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating time off status:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }
};