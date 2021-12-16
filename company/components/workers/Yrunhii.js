import React from "react";
import {Col, Form, Row} from "antd";
import {connect} from 'react-redux'
const reducer = ({}) => ({});

class Yrunhii extends React.Component {
    render(){
        return (
            <Row justify="center" align="center">
                <Col span={18}>
                    <Form
                        size={'small'}
                        layout="vertical"
                    >
                        Yrunhii
                    </Form>
                </Col>
            </Row>
        )
    }
}

export default connect(reducer)(Yrunhii)