import Main from "../components/Main";
import HomeTapsir from "../components/HomeTapsir";
import NotFound from "../components/NotFound";
export default [
    {
        component: Main,
        routes: [
            {
                component: HomeTapsir,
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
        ]
    },
];