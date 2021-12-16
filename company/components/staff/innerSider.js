import React from 'react';
import {Breadcrumb, Dropdown, Menu} from "antd";
const {SubMenu} = Menu;
import {
    IdcardOutlined,
    CaretDownOutlined,
} from '@ant-design/icons';
export class BC extends React.Component {
    render() {
        const {
            menus = [],
            onClick = (e) => false,
            selectedKey = '',
            page = '',
        } = this.props;
        let selectedMenu = menus.filter((c) => c.key === selectedKey)[0] || {};
        return (
            <Breadcrumb>
                <Breadcrumb.Item>{page}</Breadcrumb.Item>
                <Dropdown overlay={
                    <Menu>
                        {
                            menus.map((m) =>
                                <Menu.Item disabled={m.disabled} key={m.key} title={m.title} onClick={(e) => onClick({menu: m.key, submenu: ((m.subMenus || [])[0].key || (m.subMenus || [])[0].title || '')})}>
                                    {m.title}
                                </Menu.Item>
                            )
                        }
                    </Menu>
                }>
                    <Breadcrumb.Item>
                        <span>
                            <span onClick={() => onClick({menu: selectedMenu.key, submenu: ((selectedMenu.subMenus || [])[0].key || (selectedMenu.subMenus || [])[0].title || '')})}>{selectedMenu.title} <CaretDownOutlined style={{fontSize: 10}}/></span>
                        </span>
                    </Breadcrumb.Item>
                </Dropdown>
            </Breadcrumb>
        )
    }
}
export class InnerSider extends React.Component {
    render() {
        // console.log(window.location)
        // console.log(this.props.history)
        const {
            menus = [],
            selectedKey = '',
            openKeys = []
        } = this.props;
        return (
            <Menu
                // defaultSelectedKeys={menus.map(c => c.key)}
                selectedKeys={[selectedKey]}
                // defaultOpenKeys={menus.map(c => c.key)}
                defaultOpenKeys={openKeys}
                // openKeys={menus.map(c => c.key)}
                openKeys={openKeys}
                mode="inline"
                className={'innerSider'}
            >
                {
                    menus.map((m) =>
                        <SubMenu disabled={m.disabled} key={m.key || m.title} icon={m.icon || null} title={m.title} onTitleClick={(e) => m.onMenuClick({menu: m.key, submenu: ((m.subMenus || [])[0].key || (m.subMenus || [])[0].title || '')})}>
                            {
                                (m.subMenus || []).map((mm) =>
                                    <Menu.Item disabled={m.disabled} key={mm.key || mm.title} onClick={(e) => m.onSubClick({menu: m.key, submenu: ((m.subMenus || [])[0].key || (m.subMenus || [])[0].title || '')})}>{mm.title}</Menu.Item>
                                )
                            }
                        </SubMenu>
                    )
                }
            </Menu>
        )
    }
}