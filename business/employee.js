const BusinessEntity = require("./businessentity");
const moment = require("moment");

class Employee extends BusinessEntity {

    get(id) {
        return this.dl.getEmployee(id);
    }

    getAllEmployees(company) {
        try {
            return this.dl.getAllEmployee(company) || [];
        } catch (error) {
            console.error("Error fetching all employees:", error);
            return null;
        }
    }

    insertEmployee(employee) {
        const { emp_name, emp_no, hire_date, job, salary, dept_id, mng_id } = employee;

        const departmentExists = this.dl.getDepartment(employee.company, dept_id);
        if (!departmentExists) {
            throw new Error("Department does not exist.");
        }

        if (mng_id !== 0) {
            const managerExists = this.dl.getEmployee(mng_id);
            if (!managerExists) {
                throw new Error("Manager ID does not exist.");
            }
        }

        const today = moment().startOf("day");
        const hireDate = moment(hire_date, "YYYY-MM-DD");
        if (!hireDate.isValid() || hireDate.isAfter(today)) {
            throw new Error("Hire date must be a valid date equal to or before today's date.");
        }

        const dayOfWeek = hireDate.day();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            throw new Error("Hire date cannot be on a weekend.");
        }

        const allEmployees = this.dl.getAllEmployee(employee.company);
        if (allEmployees && allEmployees.some(emp => emp.emp_no === emp_no)) {
            throw new Error("Employee number must be unique.");
        }

        const newEmployee = this.dl.insertEmployee(employee);
        if (!newEmployee) {
            throw new Error("Failed to insert employee.");
        }
        return newEmployee;
    }

    updateEmployee(employee) {
        const { emp_id, emp_name, emp_no, hire_date, job, salary, dept_id, mng_id, company } = employee;

        const existingEmployee = this.dl.getEmployee(emp_id);
        if (!existingEmployee) {
            throw new Error(`Employee with ID ${emp_id} does not exist.`);
        }

        const departmentExists = this.dl.getDepartment(company, dept_id);
        if (!departmentExists) {
            throw new Error("Department does not exist.");
        }

        if (mng_id !== 0) {
            const managerExists = this.dl.getEmployee(mng_id);
            if (!managerExists) {
                throw new Error("Manager ID does not exist.");
            }
        }

        const today = moment().startOf("day");
        const hireDate = moment(hire_date, "YYYY-MM-DD");
        if (!hireDate.isValid() || hireDate.isAfter(today)) {
            throw new Error("Hire date must be a valid date equal to or before today's date.");
        }
        const dayOfWeek = hireDate.day();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            throw new Error("Hire date cannot be on a weekend.");
        }

        const allEmployees = this.dl.getAllEmployee(company);
        if (allEmployees && allEmployees.some(emp => emp.emp_no === emp_no && emp.emp_id !== emp_id)) {
            throw new Error("Employee number must be unique.");
        }

        const updatedEmployee = this.dl.updateEmployee(employee);
        if (!updatedEmployee) {
            throw new Error("Failed to update employee.");
        }
        return updatedEmployee;
    }

    deleteEmployee(emp_id) {
        const existingEmployee = this.dl.getEmployee(emp_id);
        if (!existingEmployee) {
            throw new Error(`Employee with ID ${emp_id} does not exist.`);
        }

        const rowsDeleted = this.dl.deleteEmployee(emp_id);
        if (rowsDeleted === 0) {
            throw new Error("Failed to delete employee.");
        }
        return rowsDeleted;
    } 
}

module.exports = new Employee();