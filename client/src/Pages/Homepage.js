import React, { useState, useEffect } from 'react';
import DefaultLayout from '../Components/DefaultLayout';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Card, Table, Alert, Button } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, ProfileOutlined, DollarOutlined } from '@ant-design/icons'; // Import icons

const Homepage = () => {
    const [recentItems, setRecentItems] = useState([]);
    const [error, setError] = useState(null);
    const [totalInvoices, setTotalInvoices] = useState(0);
    const [totalProformas, setTotalProformas] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const dispatch = useDispatch();

    // Get user's name from authentication data
    const authData = JSON.parse(localStorage.getItem('auth'));
    const userName = authData ? authData.name : '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: "SHOW_LOADING" });

                const itemsResponse = await axios.get("/api/items/get-items");
                const invoicesResponse = await axios.get("/api/invoices/get-invoice");
                const proformasResponse = await axios.get("/api/profomas/get-profoma");

                const items = itemsResponse.data;
                const invoices = invoicesResponse.data;
                const proformas = proformasResponse.data;

                setTotalInvoices(invoices.length);
                setTotalProformas(proformas.length);

                // Calculate total price from invoices
                const totalPriceFromInvoices = invoices.reduce((acc, invoice) => acc + invoice.totalAmount, 0);
                setTotalPrice(totalPriceFromInvoices);

                // Set total invoices count
                setTotalInvoices(invoices.length);

                const sortedItems = items.sort((a, b) => b.id - a.id);
                const lastThreeItems = sortedItems.slice(0, 3);
                setRecentItems(lastThreeItems);

                dispatch({ type: "HIDE_LOADING" });
            } catch (error) {
                console.log(error);
                setError("An error occurred while fetching data.");
                dispatch({ type: "HIDE_LOADING" });
            }
        };

        fetchData();
    }, [dispatch]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        // {
        //     title: 'Image',
        //     dataIndex: 'image',
        //     key: 'image',
        //     render: (text, record) => <img src={text} alt={record.name} style={{ width: '50px' }} />,
        // },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
    ];

    return (
        <DefaultLayout userName={userName} >
            {error && <Alert message={error} type="error" />}
            <div className="d-flex justify-content-between mb-2">
                <Card
                    title="Total Invoices"
                    headStyle={{ background: 'black', color: '#ffff', fontSize: '20PX' }}
                    style={{ width: 250, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)', background: '#E6F7FF' }}
                    extra={<ProfileOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                >
                    <p style={{ fontSize: '30px', marginBottom: 0 }}><b>{totalInvoices}</b></p>
                </Card>
                <Card
                    title="Total Profomas"
                    headStyle={{ background: 'black', color: '#ffff', fontSize: '20PX' }}
                    style={{ width: 250, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)', background: '#FEF0E6' }}
                    extra={<ShoppingCartOutlined style={{ fontSize: '40px', color: '#FF7A45' }} />}
                >
                    <p style={{ fontSize: '24px', marginBottom: 0 }}><b>{totalProformas}</b></p>
                </Card>
                <Card
                    title="Total Income"
                    headStyle={{ background: 'black', color: '#ffff', fontSize: '20PX' }}
                    style={{ width: 250, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)', background: '#F0FFF0' }}
                    extra={<DollarOutlined style={{ fontSize: '40px', color: '#52C41A' }} />}
                >
                    <p style={{ fontSize: '24px', marginBottom: 0 }}><b>Tshs: {totalPrice}/=</b></p>
                </Card>
            </div>
            <br />
            <Card
                title="Recent Added Items"
                style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)', background: '#f0f2f5' }}
                headStyle={{ background: '#000', color: '#fff', fontWeight: 'bold', fontSize: '25px' }}
            >
                <Table columns={columns} dataSource={recentItems} pagination={false} rowKey="id" />
            </Card>
            <Link to="/items">
                <Button type="primary" style={{ marginTop: '20px' }}>View All Items</Button>
            </Link>
        </DefaultLayout>
    );
};

export default Homepage;
