import index from "../components/index";
import home from "../components/home/index";
import Login from "../components/Login";
import Company from "../components/company/index";
import Bundles from "../components/bundle/index";
import CompanyTransactions from "../components/CompanyTransactions/index";
import CompanyRequests from "../components/company_requests/index";
import NotFound from "../components/NotFound";
import EditCompany from "../components/company/editCompany";
export default [
    {
        component: index,
        routes: [
            {
                component: Login,
                path: '/admin/login',
                exact: true
            },
            {
                component: home,
                path: '/admin',
                exact: true
            },
            {
                component: Company,
                path: '/admin/companies',
                exact: true
            },
            {
                component: Bundles,
                path: '/admin/bundles',
                exact: true
            },
            {
                component: CompanyTransactions,
                path: '/admin/transactions_company',
                exact: true
            },
            {
                component: CompanyRequests,
                path: '/admin/company_requests',
                exact: true
            },
            {
                component: EditCompany,
                path: '/admin/editCompany/:id',
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
    }
];