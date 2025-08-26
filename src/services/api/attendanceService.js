const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
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
          { field: { Name: "employee_id_c" } },
          { field: { Name: "employee_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "check_in_c" } },
          { field: { Name: "check_out_c" } },
          { field: { Name: "status_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('attendance_c', params);
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance records:", error?.response?.data?.message);
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
          { field: { Name: "employee_id_c" } },
          { field: { Name: "employee_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "check_in_c" } },
          { field: { Name: "check_out_c" } },
          { field: { Name: "status_c" } }
        ]
      };

      const response = await apperClient.getRecordById('attendance_c', id, params);
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance record with ID ${id}:`, error?.response?.data?.message);
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
          { field: { Name: "employee_id_c" } },
          { field: { Name: "employee_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "check_in_c" } },
          { field: { Name: "check_out_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [
          {
            FieldName: "employee_id_c",
            Operator: "EqualTo",
            Values: [employeeId]
          }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('attendance_c', params);
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by employee:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
return [];
    }
  }
};