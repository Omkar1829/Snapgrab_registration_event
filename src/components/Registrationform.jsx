import React from 'react'
import { Button, Form, Input, Select } from 'antd';
import Header from './Header';

const Registrationform = () => {

    const MyFormItemContext = React.createContext([]);
    function toArr(str) {
        return Array.isArray(str) ? str : [str];
    }

    const MyFormItemGroup = ({ prefix, children }) => {
        const prefixPath = React.useContext(MyFormItemContext);
        const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix]);
        return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>;
    };

    const MyFormItem = ({ name, ...props }) => {
        const prefixPath = React.useContext(MyFormItemContext);
        const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;
        return <Form.Item name={concatName} {...props} />;
    };

    const onFinish = value => {
        console.log(value);
    };
    return (
        <>

        <Header/>
            <div className='flex justify-center mt-5'>
                <div className=' w-1/2 h-auto bg-white shadow-2xl rounded-lg p-10 '>
                    <Form name="form_item_path" layout="vertical" onFinish={onFinish}>
                        <MyFormItemGroup prefix={['user']}>
                            <MyFormItemGroup prefix={['name']}>
                                <MyFormItem name="firstName" label="First Name">
                                    <Input />
                                </MyFormItem>
                                <MyFormItem name="Email" label="Email">
                                    <Input />
                                </MyFormItem>
                                <MyFormItem name="Employee ID" label="Employee ID">
                                    <Input />
                                </MyFormItem>
                                <MyFormItem name="Event ID" label="Event ID">
                                    <Input />
                                </MyFormItem>
                            </MyFormItemGroup>
                            <MyFormItem name="Type" label="Type">
                                <Select />
                            </MyFormItem>
                        </MyFormItemGroup>

                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default Registrationform
