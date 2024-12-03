const BusinessEntity = require("./businessentity");

class Department extends BusinessEntity {
    get(company, id) {
        return this.dl.getDepartment(company, id);
    }

    getAllDepartments(company) {
        try {
            return this.dl.getAllDepartment(company) || [];
        } catch (error) {
            console.error("Error fetching all departments:", error);
            return null;
        }
    }

    updateDepartment(department) {
        const { company, dept_id, dept_no } = department;

        const existingDept = this.dl.getDepartment(company, dept_id);
        if (!existingDept) {
            throw new Error("Department not found.");
        }

        const allDepartments = this.dl.getAllDepartment(company);
        if (Object.values(allDepartments).some(dept => dept.dept_no === dept_no && dept.dept_id !== dept_id)) {
            throw new Error("Department number must be unique within the company.");
        }

        const updatedDept = this.dl.updateDepartment(department);
        if (!updatedDept) {
            throw new Error("Failed to update department.");
        }
        return updatedDept;
    }

    insertDepartment(department) {
        const { company, dept_no } = department;

        const allDepartments = this.dl.getAllDepartment(company);
        if (Object.values(allDepartments).some(dept => dept.dept_no === dept_no)) {
            throw new Error("Department number must be unique within the company.");
        }

        const newDept = this.dl.insertDepartment(department);
        if (!newDept) {
            throw new Error("Failed to insert department.");
        }
        return newDept;
    }

    deleteDepartment(company, dept_id) {
        const existingDept = this.dl.getDepartment(company, dept_id);
        if (!existingDept) {
            throw new Error(`Department ${dept_id} not found in ${company}.`);
        }

        const rowsDeleted = this.dl.deleteDepartment(company, dept_id);
        if (rowsDeleted === 0) {
            throw new Error("Failed to delete department.");
        }
        return rowsDeleted;
    }
}

module.exports = new Department();