import React, { useEffect } from 'react';
import { Input, Form, Button, message } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (value) => {
        try {
            dispatch({ type: "SHOW_LOADING", });
            const res = await axios.post('/api/Users/login', value);
            dispatch({ type: "HIDE_LOADING" });
            message.success("User logged in successfully");
            localStorage.setItem("auth", JSON.stringify(res.data));
            navigate("/");
        } catch (error) {
            dispatch({ type: "HIDE_LOADING" });
            message.error("Something went wrong");
            console.log(error);
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
            <h3>Welcome to Invoice Generator (QUICK QUOTES) System</h3>
            <div className='login-form'>
                <h1>QUICK QUOTES</h1>
                <h3>Sign Here</h3>
                <Form layout="vertical" onFinish={handleSubmit}>
                    <div className="input-label">User ID</div>
                    <Form.Item name="userId" rules={[{ required: true, message: 'Please input the userID!' }]}>
                        <Input className="input-field" style={{ marginTop: '5px' }} />
                    </Form.Item>
                    <div className="input-label">Password</div>
                    <Form.Item name="password" rules={[{ required: true, message: 'Please input password!' }]}>
                        <Input.Password
                            className="input-field"
                            style={{ marginTop: '5px' }}
                            iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                            placeholder="Password"
                        />
                    </Form.Item>
                    <div className='login-actions'>
                        <p>
                            Not a user? Please <br />
                            <Link to="/register">Register Here!</Link>
                        </p>
                        <Button type="primary" htmlType="submit" className="login-button">Login</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;
