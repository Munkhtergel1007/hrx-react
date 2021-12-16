import index from "../components/index";
import Settings from "../components/settings";
import Workers from "../components/workers";
import WorkerSingle from "../components/workers/workerSingle";
import Dashboard from "../components/dashboard/Dashboard";
import Break from "../components/break/Break";
import Company from "../components/company/Company";
import Department from "../components/department/Department";
import DepartmentSingle from "../components/department/DepartmentSingle";
import Attendance from "../components/attendance/Attendance";
import Vacation from "../components/vacation/Vacation";
import Report from "../components/report/Report";
import Performance from "../components/performance/performance";
import JobDescription from "../components/jobDescription/jobDescription";
import Labor from "../components/labor/Labor";
import Orientation from "../components/orientation/Orientation";
import Salary from "../components/salary/Salary";
import OrlogoZarlaga from "../components/orlogoZarlaga/OrlogoZarlaga";
import SalaryLogs from "../components/salary/SalaryLog";
import Organization from "../components/organization";
import Workplan from "../components/workPlan/Workplan";
import ReferenceSingle from "../components/reference/ReferenceSingle";
import Task from "../components/task/Task";
import Assets from "../components/assets/Assets";
import Categories from "../components/category/Categories";
import Product from "../components/product/Product";
import Warehouse from "../components/warehouse/Warehouse";
import WarehouseSingle from "../components/warehouse/WarehouseSingle";
import WarehouseSold from "../components/warehouse/WarehouseSold";
import WarehouseRequest from "../components/warehouse/WarehouseRequest";
import WarehouseInteraction from "../components/warehouse/WarehouseInteraction";
import NothingComp from "../components/nothing/NothingComp";
import NotFound from "../components/NotFound";
import Restock from "../components/Restock";
import RestockSingle from "../components/Restock/RestockSingle";
export default [
	{
		component: index,
		routes: [
			{
				component: Dashboard,
				path: "/",
				exact: true
			},
			{
				component: Company,
				path: "/company",
				exact: true
			},
			{
				component: Attendance,
				path: "/attendance",
				exact: true
			},
			{
				component: Settings,
				path: "/settings/:section",
				exact: true
			},
			{
				component: Organization,
				path: "/organization/:section",
				exact: true
			},
			{
				component: JobDescription,
				path: "/job-description",
				exact: true
			},
			{
				component: Orientation,
				path: "/orientation",
				exact: true
			},
			{
				component: Labor,
				path: "/labor-relation",
				exact: true
			},
			{
				component: Workers,
				path: "/workers",
				exact: true
			},
			{
				component: Break,
				path: "/break",
				exact: true
			},
			{
				component: Vacation,
				path: "/vacation",
				exact: true
			},
			// {
			//     component: Report,
			//     path: '/report',
			//     exact: true
			// },
			{
				component: Performance,
				path: "/performance",
				exact: true
			},
			{
				component: Workplan,
				path: "/work_plan",
				exact: true
			},
			// {
			//     component: NothingComp,
			//     path: '/fdsfsfsdfdsf',
			//     exact: true
			// },
			{
				component: Salary,
				path: "/salary",
				exact: true
			},
			{
				component: OrlogoZarlaga,
				path: "/orlogo_zarlaga",
				exact: true
			},
			{
				component: SalaryLogs,
				path: "/salary/logs",
				exact: true
			},
			{
				component: WorkerSingle,
				path: "/worker/:_id/:section",
				exact: true
			},
			{
				component: Department,
				path: "/department",
				exact: true
			},
			{
				component: DepartmentSingle,
				path: "/department/:_id",
				exact: true
			},
			{
				component: ReferenceSingle,
				path: "/reference/:worker",
				exact: true
			},
			{
				component: Task,
				path: "/task",
				exact: true
			},
			{
				component: Assets,
				path: "/asset",
				exact: true
			},
			{
				component: Categories,
				path: "/category",
				exact: true
			},
			{
				component: Product,
				path: "/product",
				exact: true
			},
			{
				component: Warehouse,
				path: "/warehouse",
				exact: true
			},
			{
				component: WarehouseSingle,
				path: "/warehouse/:_id",
				exact: true
			},
			{
				component: WarehouseSold,
				path: "/warehouse/:_id/sold",
				exact: true
			},
			{
				component: WarehouseRequest,
				path: "/warehouse/:_id/request",
				exact: true
			},
			{
				component: WarehouseInteraction,
				path: "/warehouse/:_id/interaction",
				exact: true
			},
			{
				component: Restock,
				path: "/restock",
				exact: true
			},
			{
				component: RestockSingle,
				path: "/restock/:_id",
				exact: true
			},
			{
				component: NotFound,
				path: "/not-found"
			},
			{
				component: NotFound,
				path: "*"
			}
		]
	}
];
