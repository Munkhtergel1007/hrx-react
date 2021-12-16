import Main from "../components/Main";
import Home from "../components/Home";
import NotFound from "../components/NotFound";
export default [
    {
        component: Main,
        routes: [
            {
                component: Home,
                path: '/',
                exact: true
            },
            {
                component: Home,
                path: '/api/reset/password/:token',
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
        ]
    },
];