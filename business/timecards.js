const BusinessEntity = require("./businessentity");
const moment = require("moment");


class TimeCard extends BusinessEntity {

    getTimecard(timecard_id) {
        const timecard = this.dl.getTimecard(timecard_id);
        if (!timecard) {
            throw new Error(`Timecard with ID ${timecard_id} does not exist.`);
        }
        return timecard;
    }

    getAllTimecards(emp_id) {
        const timecards = this.dl.getAllTimecard(emp_id);
        if (!timecards || timecards.length === 0) {
            throw new Error(`No timecards found for employee ID ${emp_id}.`);
        }
        return timecards;
    }

    insertTimecard(timecard) {
        const { emp_id, start_time, end_time } = timecard;

        const employeeExists = this.dl.getEmployee(emp_id);
        if (!employeeExists) {
            throw new Error("Employee ID does not exist.");
        }

        const startTime = moment(start_time, "YYYY-MM-DD HH:mm:ss", true);
        const endTime = moment(end_time, "YYYY-MM-DD HH:mm:ss", true);
        const now = moment();

        if (!startTime.isValid() || !endTime.isValid()) {
            throw new Error("Start time and end time must be valid date and time formats.");
        }

        if (startTime.isAfter(now) || startTime.isBefore(now.clone().subtract(1, "week"))) {
            throw new Error("Start time must be within the last week or today.");
        }

        if (!startTime.isSame(endTime, 'day') || endTime.diff(startTime, 'hours') < 1) {
            throw new Error("End time must be on the same day as start time and at least 1 hour later.");
        }

        const dayOfWeek = startTime.day();
        if (dayOfWeek === 0 || dayOfWeek === 6 || endTime.day() === 0 || endTime.day() === 6) {
            throw new Error("Start time and end time cannot be on a weekend.");
        }

        if (startTime.hour() < 6 || startTime.hour() >= 18 || endTime.hour() < 6 || endTime.hour() > 18) {
            throw new Error("Start time and end time must be between 06:00 and 18:00.");
        }

        const timecards = this.dl.getAllTimecard(emp_id);
        if (timecards.some(tc => moment(tc.start_time).isSame(startTime, "day"))) {
            throw new Error("A timecard already exists for this employee on the specified start time day.");
        }

        const newTimecard = this.dl.insertTimecard(timecard);
        if (!newTimecard) {
            throw new Error("Failed to insert timecard.");
        }
        return newTimecard;
    }

    updateTimecard(timecard) {
        const { timecard_id, start_time, end_time } = timecard;

        
        const existingTimecard = this.dl.getTimecard(timecard_id);
        if (!existingTimecard) {
            throw new Error(`Timecard with ID ${timecard_id} does not exist.`);
        }
        const emp_id = existingTimecard.emp_id;  

        const startTime = moment(start_time, ["YYYY-MM-DD HH:mm:ss", "YYYY-M-D HH:mm:ss"], true);
        const endTime = moment(end_time, ["YYYY-MM-DD HH:mm:ss", "YYYY-M-D HH:mm:ss"], true);
        const now = moment();

        if (!startTime.isValid() || !endTime.isValid()) {
            throw new Error("Start time and end time must be valid date and time formats.");
        }

        if (startTime.isAfter(now) || startTime.isBefore(now.clone().subtract(1, "week"))) {
            throw new Error("Start time must be within the last week or today.");
        }

        if (!startTime.isSame(endTime, 'day') || endTime.diff(startTime, 'hours') < 1) {
            throw new Error("End time must be on the same day as start time and at least 1 hour later.");
        }

        const dayOfWeek = startTime.day();
        if (dayOfWeek === 0 || dayOfWeek === 6 || endTime.day() === 0 || endTime.day() === 6) {
            throw new Error("Start time and end time cannot be on a weekend.");
        }

        if (startTime.hour() < 6 || startTime.hour() >= 18 || endTime.hour() < 6 || endTime.hour() > 18) {
            throw new Error("Start time and end time must be between 06:00 and 18:00.");
        }

        const timecards = this.dl.getAllTimecard(emp_id);
        if (timecards.some(tc => moment(tc.start_time).isSame(startTime, "day") && tc.timecard_id !== timecard_id)) {
            throw new Error("A timecard already exists for this employee on the specified start time day.");
        }

        const updatedTimecard = this.dl.updateTimecard({ timecard_id, start_time, end_time });
        if (!updatedTimecard) {
            throw new Error("Failed to update timecard.");
        }
        return updatedTimecard;
    }

    deleteTimecard(timecard_id) {
        const existingTimecard = this.dl.getTimecard(timecard_id);
        if (!existingTimecard) {
            throw new Error(`Timecard with ID ${timecard_id} does not exist.`);
        }

        const rowsDeleted = this.dl.deleteTimecard(timecard_id);
        if (rowsDeleted === 0) {
            throw new Error("Failed to delete timecard.");
        }
        return rowsDeleted;
    }

}

module.exports = new TimeCard();
