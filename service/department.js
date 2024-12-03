const express = require("express");
const router = express.Router();
const department = require("../business/department");

router.get("/", (req, res) => {
    const { company, dept_id } = req.query;
    if (dept_id) {
        res.json(department.get(company, dept_id));
    } else {
        const departments = department.getAllDepartments(company);
        if (departments) {
            res.json(departments);
        } else {
            res.status(500).json({ error: "An error occurred while fetching departments." });
        }
    }
});

router.post("/", (req, res) => {
    const newDepartment = req.body;
    const { company, dept_name, dept_no, location } = newDepartment;

    if (!company || !dept_name || !dept_no || !location) {
        return res.status(400).json({ error: "All fields (company, dept_name, dept_no, location) are required." });
    }

    try {
        const result = department.insertDepartment(newDepartment);
        res.json({ success: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/", (req, res) => {
    const updatedDepartment = req.body;
    const { company, dept_id, dept_no, dept_name, location } = updatedDepartment;

    if (!company || !dept_id || !dept_no || !dept_name || !location) {
        return res.status(400).json({ error: "All fields (company, dept_id, dept_no, dept_name, location) are required." });
    }

    try {
        const result = department.updateDepartment(updatedDepartment);
        res.json({ success: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/", (req, res) => {
    const { company, dept_id } = req.query;

    if (!company || !dept_id) {
        return res.status(400).json({ error: "Both company and dept_id are required." });
    }

    try {
        const rowsDeleted = department.deleteDepartment(company, dept_id);
        res.json({ success: `Department ${dept_id} from ${company} deleted.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;