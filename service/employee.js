const express = require("express");
const router = express.Router();
const employee = require("../business/employee");

router.get("/", (req, res) => {
    const { company, emp_id } = req.query;

    if (emp_id) {
        const result = employee.get(emp_id);
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: `Employee with ID ${emp_id} not found.` });
        }
    } else if (company) {
        const employees = employee.getAllEmployees(company);
        if (employees) {
            res.json(employees);
        } else {
            res.status(500).json({ error: "An error occurred while fetching employees." });
        }
    } else {
        res.status(400).json({ error: "Either emp_id or company is required." });
    }
});

router.post("/", (req, res) => {
    const { emp_name, emp_no, hire_date, job, salary, dept_id, mng_id, company } = req.body;

    if (!emp_name || !emp_no || !hire_date || !job || !salary || !dept_id || company === undefined) {
        return res.status(400).json({ error: "All fields (emp_name, emp_no, hire_date, job, salary, dept_id, mng_id, company) are required." });
    }

    try {
        const result = employee.insertEmployee(req.body);
        res.json({ success: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/", (req, res) => {
    const updatedEmployee = req.body;
    const { emp_id, emp_name, emp_no, hire_date, job, salary, dept_id, mng_id, company } = updatedEmployee;

    if (!emp_id || !emp_name || !emp_no || !hire_date || !job || !salary || !dept_id || company === undefined) {
        return res.status(400).json({ error: "All fields (emp_id, emp_name, emp_no, hire_date, job, salary, dept_id, mng_id, company) are required." });
    }

    try {
        const result = employee.updateEmployee(updatedEmployee);
        res.json({ success: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/", (req, res) => {
    const { emp_id } = req.query;

    if (!emp_id) {
        return res.status(400).json({ error: "Employee ID (emp_id) is required." });
    }

    try {
        const rowsDeleted = employee.deleteEmployee(emp_id);
        res.json({ success: `Employee ${emp_id} deleted.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
