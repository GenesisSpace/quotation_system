import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Layout, Menu, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    LogoutOutlined,
    HomeOutlined,
    CopyOutlined,
    UnorderedListOutlined,
    ShoppingCartOutlined
} from "@ant-design/icons";
import "../styles/DefaultLayout.css";
import Spinner from "./Spinner";

const { Header, Sider, Content } = Layout;
const { confirm } = Modal;

const DefaultLayout = ({ children }) => {
    const { cartItems, loading } = useSelector(state => state.rootReducer)
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    // Check authentication status
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('auth');
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, []);

    const toggle = () => {
        setCollapsed(
            !collapsed
        );
    };

    //to get localstorage data
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }, [cartItems])

    const handleLogout = () => {
        confirm({
            title: 'Logout',
            content: 'Are you sure you want to logout?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                localStorage.removeItem('auth');
                navigate('/login');
            }
        });
    };

    return (
        <Layout>
            {loading && <Spinner />}
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo">
                    <h1 className="text-center text-light font-wight-bold mt-4">QUICK QUOTES</h1>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={window.location.pathname}
                >
                    <Menu.Item key="/" icon={<HomeOutlined style={{ color: 'blue' }} />}>
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="/Profoma" icon={<CopyOutlined style={{ color: 'green' }} />}>
                        <Link to="/Profoma">Profoma</Link>
                    </Menu.Item>
                    <Menu.Item key="/Invoices" icon={<CopyOutlined style={{ color: 'green', cursor: 'pointer' }} />}>
                        <Link to="/Invoices">Invoices</Link>
                    </Menu.Item>
                    <Menu.Item key="/items" icon={<UnorderedListOutlined style={{ color: 'orange', cursor: 'pointer' }} />}>
                        <Link to="/items">Items</Link>
                    </Menu.Item>
                    <Menu.Item key="/Customers" icon={<UserOutlined style={{ color: 'lightblue' }} />}>
                        <Link to="/Customers">Customers</Link>
                    </Menu.Item>
                    <Menu.Item key="/logout" icon={<LogoutOutlined style={{ color: 'red', cursor: 'pointer' }} />}
                        onClick={handleLogout}>
                        Logout
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    {React.createElement(
                        collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                        {
                            className: "trigger",
                            onClick: toggle,
                        }
                    )}
                    <div
                        className="cart-item d-flex jusitfy-content-space-between flex-row"
                        onClick={() => navigate("/cart")}
                    >
                        <p>{cartItems.length}</p>
                        <ShoppingCartOutlined style={{ color: 'green' }} />
                    </div>
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );

}

export default DefaultLayout;
