import React, { useState, useEffect } from 'react';
import { Input, Form, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const Register = () => {
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            dispatch({ type: "SHOW_LOADING" });
            await axios.post("/api/Users/register", values);
            message.success('Registered Successfully');
            navigate('/login');
            dispatch({ type: "HIDE_LOADING" });
        } catch (error) {
            message.error('Oops! Something went wrong');
            console.error(error);
            setError("An error occurred while registering.");
        }
    };

    //currently login user
    useEffect(() => {
        if (localStorage.getItem('auth')) {
            localStorage.getItem('auth')
            navigate('/');
        }
    }, [navigate])


    return (
        <div className='login-container'>
            <div className='registers-form'>
                <h1>QUICK QUOTES</h1>
                <h3>Register Here</h3>
                <Form layout="vertical" onFinish={handleSubmit}>
                    <div className="input-label">Full Name</div>
                    <Form.Item name="name" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} rules={[{ required: true, message: 'Please input the name!' }]}>
                        <Input className="register-field" style={{ marginTop: '5px' }} />
                    </Form.Item>
                    <div className="input-label">User ID</div>
                    <Form.Item name="userId" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} rules={[{ required: true, message: 'Please input the userID!' }]}>
                        <Input className="register-field" style={{ marginTop: '5px' }} />
                    </Form.Item>
                    <div className="input-label">Password</div>
                    <Form.Item name="password" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} rules={[{ required: true, message: 'Please input the password!' }]}>
                        <Input type="password" className="register-field" style={{ marginTop: '5px' }} />
                    </Form.Item>
                    <div className='login-actions'>
                        <p  >
                            Already Registered? Please
                            <br />
                            <Link to="/login">Login  Here!</Link>
                        </p>
                        <Button type="primary" htmlType="submit" className=' login-button'>Register</Button>
                    </div>
                </Form>
            </div>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Register;
