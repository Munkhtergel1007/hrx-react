import NotFound from "../components/NotFound";
import MassAttendance from "../components/massAttendance/MassAttendance";
export default [
    {
        component: MassAttendance,
        path: '/',
        exact: true
    },
    {
        component: NotFound,
        path: '/not-found'
    },
    {
        component: NotFound,
        path: '*'
    },
];