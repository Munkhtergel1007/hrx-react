import React, {Fragment} from 'react';
import {Modal, Checkbox, Row, Col, Divider} from 'antd';
export default class ExportExcel extends React.PureComponent {
    renderBody(param){
        const {exportChecked , setExport} = this.props;
        switch(param){
            case 'salary':
                return <Salary exportChecked={exportChecked} setExport={setExport.bind(this)}/>
            case 'attendance':
                return <Attendance exportChecked={exportChecked} setExport={setExport.bind(this)}/>
            default:
                return null;
        }
    }
    render(){
        const {hideExportM , exportType , exportDisp , exportAll , exportModal, type, loading} = this.props;
        return (
            <Modal
            title="Экспортын тохиргоо"
            visible={exportModal}
            onOk={exportType == 'disp' ? exportDisp.bind(this) : exportType == 'all' ? exportAll.bind(this) : null}
            onCancel={hideExportM.bind(this)}
            okText="Экспорт"
            cancelText="Цуцлах"
            size="small"
            wrapClassName="exportExcel"
            confirmLoading={loading || false}
            >
                {
                    this.renderBody(type)
                }
            </Modal>
        )
    }
}


const Salary = (props) => {
    return (
        <div>
            <Divider orientation='center' plain style={{marginTop:0}}>Хуудаслалт</Divider>
            <Row  gutter={20}>
                <Col span={24}>
                    <Checkbox checked={props.exportChecked.splitCompany} name="splitCompany" onChange={props.setExport.bind(this)}>
                        Компаниар салгаж авах
                    </Checkbox>
                </Col>
            </Row>
            <Divider orientation='center' plain>Хүснэгтийн багана</Divider>
            <Row  gutter={20}>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.last_name} name="last_name" onChange={props.setExport.bind(this)}>
                        Овог
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.first_name} name="first_name" onChange={props.setExport.bind(this)}>
                        Нэр
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.register} name="register" onChange={props.setExport.bind(this)}>
                        Регистр
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.company} name="company" onChange={props.setExport.bind(this)}>
                        Компани
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.salary} name="salary" onChange={props.setExport.bind(this)}>
                        Үндсэн цалин
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.nemegdel} name="nemegdel" onChange={props.setExport.bind(this)}>
                        Нэмэгдэл
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.uramshuulal} name="uramshuulal" onChange={props.setExport.bind(this)}>
                        Урамшуулал
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.iluu_tsagiin_huls} name="iluu_tsagiin_huls" onChange={props.setExport.bind(this)}>
                        Илүү цагийн хөлс
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.bonus_busad} name="bonus_busad" onChange={props.setExport.bind(this)}>
                        Бусад нэмэгдэл
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.n_d_sh} name="n_d_sh" onChange={props.setExport.bind(this)}>
                        НДШ
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.h_h_o_a_t} name="h_h_o_a_t" onChange={props.setExport.bind(this)}>
                        ХХОАТ
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.hotsrolt} name="hotsrolt" onChange={props.setExport.bind(this)}>
                        Хоцролт
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.taslalt} name="taslalt" onChange={props.setExport.bind(this)}>
                        Таслалт
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.fine_busad} name="fine_busad" onChange={props.setExport.bind(this)}>
                        Бусад суутгалт
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.hungulult} name="hungulult" onChange={props.setExport.bind(this)}>
                        ХХОАТ хөнгөлөлт
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.hool_unaanii_mungu} name="hool_unaanii_mungu" onChange={props.setExport.bind(this)}>
                        Хоол унааны мөнгө
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.bank} name="bank" onChange={props.setExport.bind(this)}>
                        Данс
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.total} name="total" onChange={props.setExport.bind(this)}>
                        Олгож буй цалин
                    </Checkbox>
                </Col>
            </Row>
        </div>
    )
}

const Attendance = (props) => {
    return (
        <div>
            <Divider orientation='center' plain style={{marginTop:0}}>Хуудаслалт</Divider>
            <Row gutter={20}>
                <Col span={24}>
                    <Checkbox checked={props.exportChecked.splitCompany} name="splitCompany" onChange={props.setExport.bind(this)}>
                        Компаниар салгаж авах
                    </Checkbox>
                </Col>
            </Row>
            <Divider orientation='center' plain>Хүснэгтийн багана</Divider>
            <Row  gutter={20}>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.last_name} name="last_name" onChange={props.setExport.bind(this)}>
                        Овог
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.first_name} name="first_name" onChange={props.setExport.bind(this)}>
                        Нэр
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.register} name="register" onChange={props.setExport.bind(this)}>
                        Регистр
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.company} name="company" onChange={props.setExport.bind(this)}>
                        Компани
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.workedHour} name="workedHour" onChange={props.setExport.bind(this)}>
                        Ажилласан цаг
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.workingDay} name="workingDay" onChange={props.setExport.bind(this)}>
                        Ажиллах өдрүүд
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.vacation} name="vacation" onChange={props.setExport.bind(this)}>
                        Амарсан өдрүүд
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.break} name="break" onChange={props.setExport.bind(this)}>
                        Чөлөөтэй өдрүүд
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.came} name="came" onChange={props.setExport.bind(this)}>
                        Ирсэн
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.late} name="late" onChange={props.setExport.bind(this)}>
                        Хоцорсон
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.wentEarly} name="wentEarly" onChange={props.setExport.bind(this)}>
                        Эрт явсан
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox checked={props.exportChecked.wentWithoutChecking} name="wentWithoutChecking" onChange={props.setExport.bind(this)}>
                        Явсан цаг бүртгүүлээгүй
                    </Checkbox>
                </Col>
            </Row>
        </div>
    )
}