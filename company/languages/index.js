import settings from "../reducers/settings";

const employeeRs = require('./rus/employee.json');
const employeeMn = require('./mgl/employee.json');
const employeeKz = require('./kaz/employee.json');

const dashboardRs = require('./rus/dashboard.json');
const dashboardMn = require('./mgl/dashboard.json');
const dashboardKz = require('./kaz/dashboard.json');

const albaRs = require('./rus/alba.json');
const albaMn = require('./mgl/alba.json');
const albaKz = require('./kaz/alba.json');

const settingsRs = require('./rus/settings.json');
const settingsMn = require('./mgl/settings.json');
const settingsKz = require('./kaz/settings.json');

const A_TushaalRs = require('./rus/A_Tushaal.json');
const A_TushaalMn = require('./mgl/A_Tushaal.json');
const A_TushaalKz = require('./kaz/A_Tushaal.json');

const tagsRs = require('./rus/tags.json');
const tagsMn = require('./mgl/tags.json');
const tagsKz = require('./kaz/tags.json');

const timetableRs = require('./rus/timetable.json');
const timetableMn = require('./mgl/timetable.json');
const timetableKz = require('./kaz/timetable.json');

const subsidiaryRs = require('./rus/subsidiary.json');
const subsidiaryMn = require('./mgl/subsidiary.json');
const subsidiaryKz = require('./kaz/subsidiary.json');

const attendanceRs = require('./rus/attendance.json');
const attendanceMn = require('./mgl/attendance.json');
const attendanceKz = require('./kaz/attendance.json');

const jobdescriptionRs = require('./rus/job-description.json');
const jobdescriptionMn = require('./mgl/job-description.json');
const jobdescriptionKz = require('./kaz/job-description.json');

const salaryRs = require('./rus/salary.json');
const salaryMn = require('./mgl/salary.json');
const salaryKz = require('./kaz/salary.json');

const taskRs = require('./rus/task.json');
const taskMn = require('./mgl/task.json');
const taskKz = require('./kaz/task.json');

const warehouseRs = require('./rus/warehouse.json');
const warehouseMn = require('./mgl/warehouse.json');
const warehouseKz = require('./kaz/warehouse.json');
const organizationRs = require('./rus/organization.json');
const organizationMn = require('./mgl/organization.json');
const organizationKz = require('./kaz/organization.json');

const breakRs = require('./rus/break.json');
const breakMn = require('./mgl/break.json');
const breakKz = require('./kaz/break.json');

const vacationRs = require('./rus/vacation.json');
const vacationMn = require('./mgl/vacation.json');
const vacationKz = require('./kaz/vacation.json');

const common_orientationRs = require('./rus/orientation.json');
const common_orientationMn = require('./mgl/orientation.json');
const common_orientationKz = require('./kaz/orientation.json');

export const mn = {
    ...albaMn,
    ...subsidiaryMn,
    ...timetableMn,
    ...tagsMn,
    ...A_TushaalMn,
    ...settingsMn,
    ...dashboardMn,
    ...employeeMn,
    ...attendanceMn,
    ...salaryMn,
    ...taskMn,
    ...organizationMn,
    ...warehouseMn,
    ...breakMn,
    ...vacationMn,

    ...jobdescriptionMn,
    ...common_orientationMn
}
export const rs = {
    ...albaRs,
    ...subsidiaryRs,
    ...timetableRs,
    ...tagsRs,
    ...A_TushaalRs,
    ...settingsRs,
    ...dashboardRs,
    ...employeeRs,
    ...attendanceRs,
    ...salaryRs,
    ...taskRs,
    ...organizationRs,
    ...warehouseRs,
    ...breakRs,
    ...vacationRs,

    ...jobdescriptionRs,
    ...common_orientationRs
}
export const kz = {
    ...albaKz,
    ...subsidiaryKz,
    ...timetableKz,
    ...tagsKz,
    ...A_TushaalKz,
    ...settingsKz,
    ...dashboardKz,
    ...employeeKz,
    ...attendanceKz,
    ...salaryKz,
    ...taskKz,
    ...organizationKz,
    ...attendanceKz,
    ...warehouseKz,
    ...breakKz,
    ...vacationKz,

    ...jobdescriptionKz,
    ...common_orientationKz
}
