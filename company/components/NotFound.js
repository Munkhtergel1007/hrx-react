import React, { Component } from "react";
import { Result, Button } from 'antd';
import { connect } from 'react-redux';
const reducer = ({ main }) => ({ main });

class NotFound extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Уучлаарай! Таны хандсан хуудас олдсонгүй!"
                extra={<Button type="primary" onClick={() => window.location.assign('/')}>Самбар харах</Button>}
            />
        );
    }
}

export default  connect(reducer)(NotFound);