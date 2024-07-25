import React, { useState, useEffect } from "react";
import DefaultLayout from "../Components/DefaultLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { DeleteOutlined } from '@ant-design/icons';
import { Table, Button, Popconfirm, message } from "antd"; // Import Popconfirm and message for confirmation dialog and feedback
const CutomerPage = () => {
    const [invoiceData, setInvoiceData] = useState([]);
    const dispatch = useDispatch();
    const getAllInvoices = async () => {
        try {
            dispatch({
                type: "SHOW_LOADING",
            });
            const { data } = await axios.get("/api/invoices/get-invoice");
            setInvoiceData(data);
            dispatch({ type: "HIDE_LOADING" });
            console.log(data);
        } catch (error) {
            dispatch({ type: "HIDE_LOADING" });
            console.log(error);
        }
    };

    const deleteCustomer = async (customerId) => {
        try {
            dispatch({
                type: "SHOW_LOADING",
            });
            await axios.delete(`/api/customers/${customerId}`);
            message.success("Customer deleted successfully!");
            await getAllInvoices();
        } catch (error) {
            message.error("Failed to delete customer");
        } finally {
            dispatch({ type: "HIDE_LOADING" });
        }
    };

    // useEffect
    useEffect(() => {
        getAllInvoices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        { title: "ID", dataIndex: "_id" },
        {
            title: "Customer Name",
            dataIndex: "customerName",
        },
        { title: "Contact No", dataIndex: "customerNumber" },
        {
            title: "Action",
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure you want to delete this customer?"
                    onConfirm={() => deleteCustomer(record._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="danger" icon={<DeleteOutlined />} size="small">
                        Delete
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <DefaultLayout>
            <h1>Customer Page</h1>
            <Table
                columns={columns}
                dataSource={invoiceData}
                bordered
                pagination={false}
            />
        </DefaultLayout>
    );
};

export default CutomerPage;
