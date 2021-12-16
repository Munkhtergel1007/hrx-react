import { Drawer, Tag } from 'antd';
import React from 'react';
const Review = ({visible, title, description, selectedEmps, deleteVisible, isReceived, emp}) => {
    return (
        <Drawer
            title='Тайлангийн мэдээлэл'
            width={720}
            visible={visible}
            maskClosable={true}
            onClose={() => deleteVisible()}
        >
            <h1>{title}</h1>
            <p>{description}</p>
            {
                isReceived ? (
                    <Tag>
                        {((emp || {}).last_name[0] || []).toUpperCase()}.
                        {(emp || {}).first_name.toString().charAt(0).toUpperCase()+(emp || {})
                            .first_name.toString().slice(1)
                        }
                    </Tag>
                ) 
                : 
                <>
                    {(selectedEmps || [] ).map(emp =>
                        <Tag key={emp._id} color={emp.viewed ? 'green': null} >
                            {((emp.user || {}).last_name[0] || []).toUpperCase()}.
                            {(emp.user || {}).first_name.toString().charAt(0).toUpperCase()+(emp.user || {})
                                .first_name.toString().slice(1)
                            }
                        </Tag>
                    )}
                </>
                    
                
            }
        </Drawer>
    );
}
 
export default Review;