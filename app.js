const express = require ("express");
const app = express();
const port = 3000;
const base = "/leskovac-janko-p3/api";
const departmentRouter = require("./service/department");
const employeeRouter = require("./service/employee");
const timecardRouter = require("./service/timecards");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(`${base}/department`, departmentRouter);
app.use(`${base}/employee`, employeeRouter);
app.use(`${base}/timecard`, timecardRouter);

app.listen(port, ()=>{
    console.log(`App is running at http://localhost:${port}/`);
});

module.exports = app;


