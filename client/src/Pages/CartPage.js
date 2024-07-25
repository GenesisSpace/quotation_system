import React, { useState, useEffect } from "react";
import DefaultLayout from "../Components/DefaultLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    DeleteOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
} from "@ant-design/icons";
import { Table, Button, Modal, message, Form, Input, Select, DatePicker, Card, InputNumber } from "antd";

const CartPage = () => {
    const [subTotal, setSubTotal] = useState(0);
    const [marginPercentage, setMarginPercentage] = useState(30); // Default margin percentage
    const [taxPercentage, setTaxPercentage] = useState(18); // Default tax percentage
    const [invoicePopup, setInvoicePopup] = useState(false);
    const [profomaPopup, setProfomaPopup] = useState(false);
    const [invoiceNumber, setInvoiceNumber] = useState("001");
    const [profomaNumber, setProfomaNumber] = useState("001");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.rootReducer);

    const handleIncrement = (record) => {
        dispatch({
            type: "UPDATE_CART",
            payload: { ...record, quantity: record.quantity + 1 },
        });
    };

    const handleDecrement = (record) => {
        if (record.quantity !== 1) {
            dispatch({
                type: "UPDATE_CART",
                payload: { ...record, quantity: record.quantity - 1 },
            });
        }
    };

    const cartItemsWithSerial = cartItems.map((item, index) => ({
        ...item,
        serial: index + 1,
    }));

    const columns = [
        { title: "Serial", dataIndex: "serial" },
        { title: "Name", dataIndex: "name" },
        {
            title: "Price",
            dataIndex: "price",
            render: (price) => `Tsh: ${price.toLocaleString()}`
        },
        {
            title: "Quantity",
            dataIndex: "_id",
            render: (id, record) => (
                <div>
                    <PlusCircleOutlined
                        className="mx-3"
                        style={{ cursor: "pointer", color: 'green' }}
                        onClick={() => handleIncrement(record)}
                    />
                    <b>{record.quantity}</b>
                    <MinusCircleOutlined
                        className="mx-3"
                        style={{ cursor: "pointer", color: 'orange' }}
                        onClick={() => handleDecrement(record)}
                    />
                </div>
            ),
        },
        {
            title: "Actions",
            dataIndex: "_id",
            render: (id, record) => (
                <DeleteOutlined
                    style={{ cursor: "pointer", color: 'red' }}
                    onClick={() =>
                        dispatch({
                            type: "DELETE_FROM_CART",
                            payload: record,
                        })
                    }
                />
            ),
        },
    ];

    useEffect(() => {
        let temp = 0;
        cartItems.forEach((item) => (temp += item.price * item.quantity));
        const marginAmount = temp * (marginPercentage / 100);
        const marginSubTotal = temp + marginAmount;
        const taxAmount = marginSubTotal * (taxPercentage / 100);
        const total = marginSubTotal + taxAmount;
        setSubTotal(total);
    }, [cartItems, marginPercentage, taxPercentage]);

    const generateInvoiceNumber = () => {
        const existingInvoiceNumbers = cartItems.map((item) => item.invoiceNumber).filter(Boolean);
        if (existingInvoiceNumbers.length === 0) {
            return "ZINV001";
        } else {
            existingInvoiceNumbers.sort();
            const lastInvoiceNumber = existingInvoiceNumbers[existingInvoiceNumbers.length - 1];
            const lastNumber = parseInt(lastInvoiceNumber.substring(4));
            const newNumber = lastNumber + 1;
            return "ZINV" + newNumber.toString().padStart(3, '0');
        }
    };

    const generateProfomaNumber = () => {
        const existingProfomaNumbers = cartItems.map((item) => item.profomaNumber).filter(Boolean);
        if (existingProfomaNumbers.length === 0) {
            return "ZPRF001";
        } else {
            existingProfomaNumbers.sort();
            const lastProfomaNumber = existingProfomaNumbers[existingProfomaNumbers.length - 1];
            const lastNumber = parseInt(lastProfomaNumber.substring(4));
            const newNumber = lastNumber + 1;
            return "ZPRF" + newNumber.toString().padStart(3, '0');
        }
    };

    useEffect(() => {
        const lastInvoiceNumber = localStorage.getItem("lastInvoiceNumber");
        if (lastInvoiceNumber) {
            setInvoiceNumber(lastInvoiceNumber);
        }
    }, []);

    useEffect(() => {
        const lastProfomaNumber = localStorage.getItem("lastProfomaNumber");
        if (lastProfomaNumber) {
            setProfomaNumber(lastProfomaNumber);
        }
    }, []);

    const handleInvoiceSubmit = async (values) => {
        try {
            const newInvoiceNumber = generateInvoiceNumber();
            const tax = Number(((subTotal / 100) * taxPercentage).toFixed(2));
            const totalAmount = Number(subTotal) + tax;
            const userId = JSON.parse(localStorage.getItem("auth"))._id;
            const newObject = {
                ...values,
                invoiceNumber: newInvoiceNumber,
                cartItems,
                subTotal,
                tax,
                totalAmount,
                userId,
            };
            await axios.post("/api/invoices/add-invoice", newObject);
            message.success("Invoice Generated Successfully");
            const nextInvoiceNumber = String(Number(newInvoiceNumber.substring(4)) + 1).padStart(3, "0");
            setInvoiceNumber("ZINV" + nextInvoiceNumber);
            localStorage.setItem("lastInvoiceNumber", nextInvoiceNumber);
            navigate("/invoices");
        } catch (error) {
            message.error("Something went wrong");
            console.error(error);
        }
    };

    const handleProfomaSubmit = async (values) => {
        try {
            const newProfomaNumber = generateProfomaNumber();
            const tax = Number(((subTotal / 100) * taxPercentage).toFixed(2));
            const totalAmount = Number(subTotal) + tax;
            const userId = JSON.parse(localStorage.getItem("auth"))._id;
            const newObject = {
                ...values,
                profomaNumber: newProfomaNumber,
                cartItems,
                subTotal,
                tax,
                totalAmount,
                userId,
            };
            await axios.post("/api/profomas/add-profoma", newObject);
            message.success("Profoma Generated Successfully");
            const nextProfomaNumber = String(Number(newProfomaNumber.substring(4)) + 1).padStart(3, "0");
            setProfomaNumber("ZPRF" + nextProfomaNumber);
            localStorage.setItem("lastProfomaNumber", nextProfomaNumber);
            navigate("/profoma");
        } catch (error) {
            message.error("Something went wrong");
            console.error(error);
        }
    };

    return (
        <DefaultLayout>
            <Card
                title="My Cart"
                style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', background: '#f0f2f5' }}
                headStyle={{ background: '#000', color: '#fff', fontWeight: 'bold', fontSize: '25px' }}>

                <Table columns={columns} dataSource={cartItemsWithSerial} bordered />
                <div className="d-flex flex-column align-items-end">
                    <hr />
                    <h4>
                        SUB-TOTAL: Tsh: <b>{subTotal.toLocaleString()}</b> /-
                    </h4>
                    <div style={{ display: "flex", gap: "20px" }}>
                        <Button type="primary" onClick={() => setInvoicePopup(true)}>
                            Create Invoice
                        </Button>
                        <Button type="primary" onClick={() => setProfomaPopup(true)}>
                            Create Profoma
                        </Button>
                    </div>
                    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                        <InputNumber
                            min={0}
                            max={100}
                            value={marginPercentage}
                            onChange={setMarginPercentage}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                        />
                        <InputNumber
                            min={0}
                            max={100}
                            value={taxPercentage}
                            onChange={setTaxPercentage}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                        />
                    </div>
                </div>
            </Card>

            <Modal
                title="Create Invoice"
                visible={invoicePopup}
                onCancel={() => setInvoicePopup(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleInvoiceSubmit}>
                    <Form.Item name="invoiceNumber" label="Invoice Number">
                        <Input value={invoiceNumber} disabled />
                    </Form.Item>
                    <Form.Item name="customerName" label="Customer Name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="customerNumber" label="Contact Number">
                        <Input />
                    </Form.Item>
                    <Form.Item name="customerTin" label="Customer TIN">
                        <Input />
                    </Form.Item>
                    <Form.Item name="dueDate" label="Due Date">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item name="status" label="Invoice Status">
                        <Select>
                            <Select.Option value="pending">Pending</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="paymentMode" label="Payment Method">
                        <Select>
                            <Select.Option value="cash">Cash</Select.Option>
                            <Select.Option value="card">Card</Select.Option>
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Generate Invoice
                    </Button>
                </Form>
            </Modal>

            <Modal
                title="Create Profoma"
                visible={profomaPopup}
                onCancel={() => setProfomaPopup(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleProfomaSubmit}>
                    <Form.Item name="profomaNumber" label="Profoma Number">
                        <Input value={profomaNumber} disabled />
                    </Form.Item>
                    <Form.Item name="customerName" label="Customer Name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="customerNumber" label="Contact Number">
                        <Input />
                    </Form.Item>
                    <Form.Item name="dueDate" label="Due Date">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item name="paymentMode" label="Payment Method">
                        <Select>
                            <Select.Option value="cash">Cash</Select.Option>
                            <Select.Option value="card">Card</Select.Option>
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Generate Profoma
                    </Button>
                </Form>
            </Modal>
        </DefaultLayout>
    );
};

export default CartPage;
