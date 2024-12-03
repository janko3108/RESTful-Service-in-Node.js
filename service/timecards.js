const express = require("express");
const router = express.Router();
const timecard = require("../business/timecards");

router.get("/", (req, res) => {
    const { timecard_id, emp_id } = req.query;

    if (timecard_id) {
        try {
            const result = timecard.getTimecard(timecard_id);
            res.json({ timecard: result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (emp_id) {
        try {
            const timecards = timecard.getAllTimecards(emp_id);
            res.json(timecards);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(400).json({ error: "Either timecard_id or emp_id is required." });
    }
});

router.post("/", (req, res) => {
    const { emp_id, start_time, end_time } = req.body;

    if (!emp_id || !start_time || !end_time) {
        return res.status(400).json({ error: "Fields (emp_id, start_time, end_time) are required." });
    }

    try {
        const result = timecard.insertTimecard(req.body);
        res.json({ success: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/", (req, res) => {
    const { timecard_id, start_time, end_time } = req.body;

    if (!timecard_id || !start_time || !end_time) {
        return res.status(400).json({ error: "Fields (timecard_id, start_time, end_time) are required." });
    }

    try {
        const result = timecard.updateTimecard(req.body);
        res.json({ success: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/", (req, res) => {
    const { timecard_id } = req.query;

    if (!timecard_id) {
        return res.status(400).json({ error: "Timecard ID (timecard_id) is required." });
    }

    try {
        const rowsDeleted = timecard.deleteTimecard(timecard_id);
        res.json({ success: `Timecard ${timecard_id} deleted.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
