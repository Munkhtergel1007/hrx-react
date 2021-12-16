import React, {Component} from "react";
import { connect } from 'react-redux';
import config, {hasAction} from "../../config";
import moment from "moment";

import {
    Button,
    Table,
    Tag,
    Row,
    Col,
    Typography,
    Space
} from 'antd';
import {locale} from '../../lang';

const {Title} = Typography;

export class SalaryTable extends Component{
    render() {
        const {
            initial_salary = 0, add = [
                {amount: 0, type: 'nemegdel', description: ''},
                {amount: 0, type: 'uramshuulal', description: ''},
                {amount: 0, type: 'iluu_tsagiin_huls', description: ''},
                {amount: 0, type: 'busad', description: ''}
            ], sub = [
                {amount: 0, type: 'taslalt', description: ''},
                {amount: 0, type: 'hotsrolt', description: ''},
                {amount: 0, type: 'n_d_sh', description: ''},
                {amount: 0, type: 'h_h_o_a_t', description: ''},
                {amount: 0, type: 'busad', description: ''}
            ], hungulult = 0, hool_unaanii_mungu = 0, action = ''
        } = this.props.log;
        let total = initial_salary;
        (add || []).map(ad => total += (ad.amount || 0));
        (sub || []).map(su => total -= (su.amount || 0));
        total += ((hungulult || 0) + (hool_unaanii_mungu || 0));

        function getStatus(status){
            switch (status) {
                case 'created': return <Tag>{locale('common_salary.uusgesen')}</Tag>;
                case 'idle': return <Tag color='orange'>{locale('common_salary.butsaasan')}</Tag>;
                case 'updated': return <Tag color='magenta'>{locale('common_salary.shinechilsen')}</Tag>;
                case 'pending': return <Tag color='gold'>{locale('common_salary.ilgeesen')}</Tag>;
                case 'approved': return <Tag color='green'>{locale('common_salary.batalsan')}</Tag>;
                case 'declined': return <Tag color='volcano'>{locale('common_salary.tsutsalsan')}</Tag>;
                case 'deleted': return <Tag color='red'>{locale('common_salary.ustgasan')}</Tag>;
                case 're_open': return <Tag color='geekblue'>{locale('common_salary.dahin neesen')}</Tag>;
                default: return ''
            }
        }

        return (
            <div style={{width: '100%'}} className="salary-table">
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span><b>Үндсэн цалин:</b> {initial_salary}</span>
                    {
                        action === 'created' ?
                            getStatus(action)
                            :
                            null
                    }
                </div>
                <Row gutter={20}>
                    <Col span={12}>
                        <b>Нэмэгдэл</b>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Нэмэгдэл</th>
                                    <td>{add.map(ad => ad.type !== 'nemegdel' ? null : (ad.amount || 0))}</td>
                                </tr>
                                <tr>
                                    <th>Урамшуулал</th>
                                    <td>{add.map(ad => ad.type !== 'uramshuulal' ? null : (ad.amount || 0))}</td>
                                </tr>
                                <tr>
                                    <th>Илүү цагийн хөлс</th>
                                    <td>{add.map(ad => ad.type !== 'iluu_tsagiin_huls' ? null : (ad.amount || 0))}</td>
                                </tr>
                                <tr>
                                    <th>Бусад</th>
                                    <td>{add.map(ad => ad.type !== 'busad' ? null : (ad.amount || 0))}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                    <Col span={12}>
                        <b>Суутгал</b>
                        <table>
                            <tbody>
                                <tr>
                                    <th>НДШ</th>
                                    <td>{sub.map(su => su.type !== 'n_d_sh' ? null : (su.amount || 0))}</td>
                                </tr>
                                <tr>
                                    <th>ХХОАТ</th>
                                    <td>{sub.map(su => su.type !== 'h_h_o_a_t' ? null : (su.amount || 0))}</td>
                                </tr>
                                <tr>
                                    <th>Хоцролт</th>
                                    <td>{sub.map(su => su.type !== 'hotsrolt' ? null : (su.amount || 0))}</td>
                                </tr>
                                <tr>
                                    <th>Таслалт</th>
                                    <td>{sub.map(su => su.type !== 'taslalt' ? null : (su.amount || 0))}</td>
                                </tr>
                                <tr>
                                    <th>Бусад</th>
                                    <td>{sub.map(su => su.type !== 'busad' ? null : (su.amount || 0))}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        {add.map(ad => ad.type !== 'busad' ? null : ad.description ? <div><i>Тайлбар:</i><br/>{ad.description || ''}</div> : null)}
                    </Col>
                    <Col span={12}>
                        {sub.map(su => su.type !== 'busad' ? null : su.description ? <div><i>Тайлбар:</i><br/>{su.description || ''}</div> : null)}
                    </Col>
                </Row>
                <b>Хөнгөлөлт:</b> {hungulult}
                <br />
                <b>Хоол унааны мөнгө:</b> {hool_unaanii_mungu}
                <br />
                {/*<hr />*/}
                <div style={{textAlign: 'right', marginRight: 40}}><b>Нийт:</b> {total}</div>
            </div>
        );
    }
}