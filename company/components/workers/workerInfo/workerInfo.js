import React from "react";


class WorkerInfo extends React.PureComponent {
    constructor(props){
        super(props);

        this.state = {

        };
        return<div>

            <div style={{margin: '50px auto 30px'}}> 
           <Divider orientation="left" plain>
               <b style={{fontSize: 16}}>Хувийн мэдээлэл</b>
           </Divider>
       </div>
       
       <div className={'main-info'} style={{marginBottom: 20, paddingTop: 10}}>
               {/*{((empSingle || {}).avatar || {}).path ?*/}
   
               <div className='merchant-avatar'>
                   <img
                       style={{   
                           height:120,
                       }}
                       src={avatar}
                   />
   
                   {empSingle && empSingle._id && employee && employee._id && empSingle._id.toString() === employee._id.toString()?
                       <div className='merchant-avatar-edit-icon'
                            onClick={avatarLoading ? null : this.openMediaLib.bind(this, 'image', 'avatar')}
                       >
                           <CameraFilled />
                       </div>
                       :
                       null
                   }
               </div>
               {/*:*/}
               {/*<img className={'tseej_zurag'} src={"/images/default-avatar.png"}/>*/}
               {/*}*/}
               {editingMain ?
                   <div className={'info_inps'}>
                       <Row>
                           <Col span={12} style={{paddingRight: 12.5}}>
                               <Form.Item
                                   label={locale("common_employee.last_name")}
                                   name={['main', 'last_name']}
                                   rules={[
                                       {
                                           required: true,
                                           message: locale("employee_single.error.last_name.insert")
                                       }
                                   ]}
                                   initialValue={(empSingle.user || {}).last_name}
                               >
                                   <Input className="editingInput"  onChange={(e) => this.onValChange({last_name: e.target.value})} disabled={!hadAction || !editingMain}/>
                               </Form.Item>
                           </Col>
                           <Col span={12} style={{paddingLeft: 12.5}}>
                               <Form.Item
                                   label={locale("common_employee.first_name")}
                                   name={['main', 'first_name']}
                                   rules={[
                                       {
                                           required: true,
                                           message: locale("employee_single.error.first_name.insert")
                                       }
                                   ]}
                                   initialValue={(empSingle.user || {}).first_name}
                               >
                                   <Input className="editingInput"  onChange={(e) => this.onValChange({first_name: e.target.value})} disabled={!hadAction || !editingMain}/>
                               </Form.Item>
                           </Col>
                       </Row>
                       <Row>
                           <Col span={12} style={{paddingRight: 12.5}}>
                               <Form.Item
                                   label={locale("common_employee.username")}
                                   name={['main', 'username']}
                                   initialValue={(empSingle.user || {}).username}
                                   rules={[
                                       {
                                           required: true,
                                           message: locale("employee_single.error.user_name.insert"),
                                       },
                                       {
                                           pattern: new RegExp(/^[a-zA-Z0-9._]{4,12}/g),
                                           message: locale("employee_single.error.user_name.error")
                                       }
                                   ]}
                               >
                                   <Input className="editingInput"  onChange={(e) => this.onValChange({username: e.target.value})} disabled={!hadAction || !editingMain}/>
                               </Form.Item>
                           </Col>
                           <Col span={12} style={{paddingLeft: 12.5}}>
                               <Form.Item
                                   label={locale("common_employee.password")}
                                   name={['main', 'password']}
                               >
                                   <Input.Password className="editingInput"  onChange={(e) => this.onValChange({password: e.target.value})} disabled={!hadAction || !editingMain}/>
                               </Form.Item>
                           </Col>
                       </Row>
                   </div>
               :
                   <div className={'info_inps'}>
                       <Row>
                           <Col span={12} style={{paddingRight: 12.5}}>
                               <Form.Item>
                                   <span className="anketTitle">{locale("common_employee.last_name")} </span>
                                   <div className="anketInfo">
                                       {(empSingle.user || {}).last_name}
                                   </div>
                               </Form.Item>
                           </Col>
                           <Col span={12} style={{paddingLeft: 12.5}}>
                               <Form.Item>
                                   <span className="anketTitle">{locale("common_employee.first_name")} </span>
                                   <div className="anketInfo">
                                       {(empSingle.user || {}).first_name}
                                   </div>
                               </Form.Item>
                           </Col>
                       </Row>
                       <Row>
                           <Col span={12} style={{paddingRight: 12.5}}>
                               <Form.Item>
                                   <span className="anketTitle">{locale("common_employee.username")} </span>
                                   <div className="anketInfo">
                                       {(empSingle.user || {}).username}
                                   </div>
                               </Form.Item>
                           </Col>
                           <Col span={12} style={{paddingLeft: 12.5}}>
                               <Form.Item>
                                   <div className="anketTitle">{locale("common_employee.password")}</div>
                                   <div className="anketInfo"></div>
                               </Form.Item>
                           </Col>
                       </Row>
                   </div>
               }       
           </div>
           <div className={'main-info'}>
                       <div className={'info_inps'}>
                           <Row>
                               <Col span={12} style={{paddingRight: 12.5}}>
                                   <Form.Item>
                                       <div className="anketTitle">{locale("employee_single.register_id")}</div>
                                       <div className="anketInfo">
                                           {(empSingle.user || {}).register_id}
                                       </div>
                                   </Form.Item>
                               </Col>
                               <Col span={12} style={{paddingLeft: 12.5}}>
                                   <Form.Item initialValue={(empSingle.user || {}).gender ? (empSingle.user || {}).gender === 'male' ? locale("employee_single.male") : locale("employee_single.female")  : ''}>                                                
                                       <div className="anketTitle">{locale("employee_single.gender")}</div>
                                       <div className="anketInfo">
                                           {(empSingle.user || {}).gender ? (empSingle.user || {}).gender === 'male' ? locale("employee_single.male") : locale("employee_single.female") : ''} 
                                       </div>
                                   </Form.Item>
                               </Col>
                           </Row>
                       </div>
                   </div>
                   <div className={'main-info'}>
                       <div className={'info_inps'}>
                           <Row>
                               <Col span={12} style={{paddingRight: 12.5}}>
                                   <Form.Item>
                                       <div className="anketTitle">{locale("employee_single.family_name")}</div>
                                       <div className="anketInfo">
                                           {(empSingle.user || {}).family_name}
                                       </div>
                                       
                                   </Form.Item>
                               </Col>
                               <Col span={12} style={{paddingLeft: 12.5}}>
                                   <Form.Item>
                                       
                                       <div className="anketTitle">{locale("employee_single.ys_undes")}</div>
                                       <div className="anketInfo">
                                           {(empSingle.user || {}).nationality}
                                       </div>
                                   </Form.Item>
                               </Col>
                           </Row>
                       </div>
                   </div>
                   <div className={'main-info'}>
                       <div className={'info_inps'}>
                           <Row>
                               <Col span={12} style={{paddingRight: 12.5}}>
                                   <Form.Item>
                                       <div className="anketTitle">{locale("employee_single.birthday")}</div>
                                       <div className="anketInfo">
                                        {(empSingle.user || {}).birthday ? moment((empSingle.user || {}).birthday).format('YYYY-MM-DD') : null} 
                                       </div>
                                   </Form.Item>
                               </Col>
                               <Col span={12} style={{paddingLeft: 12.5}}>
                                   <Form.Item>
                                       
                                       <div className="anketTitle">{locale("employee_single.birth_place")}</div>
                                       <div className="anketInfo">
                                           {(empSingle.user || {}).birth_place}
                                       </div>
                                   </Form.Item>
                               </Col>
                           </Row>
                       </div>
                   </div>
                   <div className={'main-info'}>
                       <div className={'info_inps'}>
                           <Row>
                               <Col span={12} style={{paddingRight: 12.5}}>
                                   <Form.Item>
                                       <div className="anketTitle">{locale("common_employee.email")}</div>
                                       <div className="anketInfo">
                                           {(empSingle.user || {}).email}
                                       </div>
                                   </Form.Item>
                               </Col>
                               <Col span={12} style={{paddingLeft: 12.5}}>
                                   <Form.Item>
                                       <div className="anketTitle">{locale("common_employee.phone")}</div>
                                       <div className="anketInfo">
                                           {(empSingle.user || {}).phone}
                                       </div>
                                   </Form.Item>
                               </Col>
                           </Row>
                       </div>
                   </div>
                   <div className={'main-info'}>
                       <div className={'info_inps'}>
                           <Row>
                               <Col span={12} style={{paddingRight: 12.5}}>
                                   <Form.Item>
                                       <div className="anketTitle">{locale("employee_single.hasChild")}</div>
                                       <div className="anketInfo">
                                           {(empSingle.user || {}).hasChild ? locale("employee_single.child"): locale("employee_single.noChild")}
                                       </div>
                                       
                                   </Form.Item>
                               </Col>
                               <Col span={12} style={{paddingLeft: 12.5}}>
                                   <Form.Item>
                                       
                                       <div className="anketTitle">{locale("employee_single.childNum")}</div>
                                       <div className="anketInfo">
                                       
                                          {(empSingle.user || {}).hasChild ? `${(empSingle.user || {}).children+locale("employee_single.child")}`  : '' }
                                        
                                       </div>
                                   </Form.Item>
                               </Col>
                           </Row>
                       </div>
                   </div>
                   <div className={'main-info'}>
                       <div className={'info_inps'}>
                           <Row>
                               <Col span={12} style={{paddingRight: 12.5}}>
                                   <Form.Item>
                                       
                                           <div className="anketTitle">{locale("employee_single.blood_type")}</div>
                                           <div className="anketInfo">
                                               {(empSingle.user || {}).bloodType ? printBloodType((empSingle.user || {}).bloodType) : ''}
                                           </div>
                                   </Form.Item>
                               </Col>
                               <Col span={12} style={{paddingLeft: 12.5}}>
                                   <Form.Item>
                                           <div className="anketTitle">{locale("employee_single.driving_type")}</div>
                                           <div className="anketInfo">
                                               {(empSingle.user || {}).drivingLicense ? (empSingle.user || {}).drivingLicense.map(c => (<span className="driverLicense">{c.toUpperCase()}</span>)) : ''}
                                           </div>
                                       
                                   </Form.Item>
                               </Col>
                           </Row>
                       </div>
                   </div>
        </div>
    }
}

export default (WorkerInfo)