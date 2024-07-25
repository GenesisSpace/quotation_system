import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Modal, Button, Table, Card, Form, Input } from "antd";
import DefaultLayout from "../Components/DefaultLayout";
import logo from '../assets/zealtech.png';
import "../styles/InvoiceStyles.css";

const Profomas = () => {
    const componentRef = useRef();
    const dispatch = useDispatch();
    const [profomaData, setProfomaData] = useState([]);
    const [popupModal, setPopupModal] = useState(false);
    const [selectedProfoma, setSelectedProfoma] = useState(null);
    const [editProfoma, setEditProfoma] = useState(null);
    const [popupModalVisible, setPopupModalVisible] = useState(false);

    const getAllProfomas = async () => {
        try {
            dispatch({ type: "SHOW_LOADING" });
            const { data } = await axios.get("/api/profomas/get-profoma");
            setProfomaData(data);
            dispatch({ type: "HIDE_LOADING" });
        } catch (error) {
            dispatch({ type: "HIDE_LOADING" });
            console.log(error);
        }
    };

    useEffect(() => {
        getAllProfomas();
    }, []);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handleEditProfoma = (values) => {
        axios.put(`/api/profomas/update-profoma/${editProfoma._id}`, values)
            .then(() => {
                getAllProfomas();
                setEditProfoma(null);
                setPopupModalVisible(false);
            })
            .catch(error => {
                console.error("Failed to update profoma:", error);
            });
    };

    const columns = [
        {
            title: "Serial No",
            dataIndex: "serial",
            render: (text, record, index) => index + 1,
        },
        { title: "ID", dataIndex: "_id" },
        { title: "Profoma#", dataIndex: "profomaNumber" },
        { title: "Customer Name", dataIndex: "customerName" },
        { title: "Contact No", dataIndex: "customerNumber" },
        {
            title: "Subtotal(Tshs)",
            dataIndex: "subTotal",
            render: (subTotal) => subTotal.toLocaleString(),
        },
        {
            title: "VAT",
            dataIndex: "tax",
            render: (tax) => tax.toLocaleString(),
        },
        {
            title: "Total Amount(Tshs)",
            dataIndex: "totalAmount",
            render: (totalAmount) => totalAmount.toLocaleString(),
        },
        {
            title: "Actions",
            dataIndex: "_id",
            render: (id, record) => (
                <div>
                    <EyeOutlined
                        style={{ cursor: "pointer", color: 'green' }}
                        onClick={() => {
                            setSelectedProfoma(record);
                            setPopupModal(true);
                        }}
                    />
                    <EditOutlined
                        style={{ cursor: "pointer", marginLeft: 8, color: 'orange' }}
                        onClick={() => {
                            setEditProfoma(record);
                            setPopupModalVisible(true);
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <DefaultLayout>
            <Card
                title="Profoma List"
                style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', background: '#f0f2f5' }}
                headStyle={{ background: '#000', color: '#fff', fontWeight: 'bold', fontSize: '25px' }}
            >
                <Table
                    columns={columns}
                    dataSource={profomaData}
                    bordered
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    style={{ marginBottom: '16px' }}
                />
            </Card>

            {popupModal && (
                <Modal
                    width={900}
                    title="Profoma Details"
                    visible={popupModal}
                    onCancel={() => setPopupModal(false)}
                    footer={null}
                >
                    <div ref={componentRef} className="invoice-container print-view">
                        <div className="logo">
                            <img src={logo} alt="logo" />
                        </div>
                        <div className="info">
                            <h2>ZealTech Company Ltd</h2>
                            <p>
                                P.O. BOX 38036, Dar es salaam, Tanzania | Victoria New Bagamoyo Road Plot39A Block205 (Old BMTL House) 2nd floor.<br />
                                Call Us: +255719100800 & +255747262626<br />
                                www.zealtechtz.com | sales@zealtechtz.com<br />
                                <b>TIN: 140-985-538 , VRN: 40-314371-L</b>
                            </p>
                        </div>

                        <div className="profoma-details">
                            <p>
                                Profoma#: <b>{selectedProfoma.profomaNumber}</b><br />
                                Customer Name: <b>{selectedProfoma.customerName}</b><br />
                                Phone No: <b>{selectedProfoma.customerNumber}</b><br />
                                Date: <b>{selectedProfoma.date.toString().substring(0, 10)}</b><br />
                                Due Date: <b>{selectedProfoma.dueDate ? new Date(selectedProfoma.dueDate).toLocaleDateString() : ""}</b>
                            </p>
                            <hr />
                        </div>

                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Item</th>
                                        <th>Description</th>
                                        <th>Qty</th>
                                        <th>Price (Tshs)</th>
                                        <th>Total (Tshs)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProfoma.cartItems.map((item, index) => (
                                        <tr key={item.name}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.description}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price.toLocaleString()}</td>
                                            <td>{(item.quantity * item.price).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="4"></td>
                                        <td><b>Grand Total:</b></td>
                                        <td><b>{selectedProfoma.subTotal.toLocaleString()}</b></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4"></td>
                                        <td><b>VAT:</b></td>
                                        <td><b>{selectedProfoma.tax.toLocaleString()}</b></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4"></td>
                                        <td><b>Total VAT Incl:</b></td>
                                        <td><b>{selectedProfoma.totalAmount.toLocaleString()}</b></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="legalcopy">
                            <p>
                                <strong>PAYMENTS AND BANK DETAILS</strong><br />
                                All Payments Should be Done through:<br />
                                Account Name: ZEALTECH COMPANY LIMITED<br />
                                Account Number: 0150766033700 CRDB KIJITONYAMA BRANCH<br />
                                Account Number: 24710032889 NMB SINZA BRANCH<br />
                                If you have any question about this quotation, please contact 0713545494
                            </p>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                        <Button type="primary" onClick={handlePrint}>
                            Print
                        </Button>
                    </div>
                </Modal>
            )}

            {popupModalVisible && (
                <Modal
                    title={`${editProfoma !== null ? "Edit Profoma" : "Create Profoma"}`}
                    visible={popupModalVisible}
                    onCancel={() => {
                        setEditProfoma(null);
                        setPopupModalVisible(false);
                    }}
                    footer={[
                        <Button key="cancel" onClick={() => setPopupModalVisible(false)}>Cancel</Button>,
                        <Button key="submit" type="primary" onClick={() => handleEditProfoma(editProfoma)}>Save</Button>,
                    ]}
                >
                    <Form layout="vertical">
                        <Form.Item label="Profoma Number">
                            <Input value={editProfoma?.profomaNumber} disabled />
                        </Form.Item>
                        <Form.Item label="Customer Name">
                            <Input value={editProfoma?.customerName} disabled />
                        </Form.Item>
                        <Form.Item label="Customer Number">
                            <Input value={editProfoma?.customerNumber} disabled />
                        </Form.Item>
                        <Form.Item label="Due Date">
                            <Input value={editProfoma?.dueDate} disabled />
                        </Form.Item>
                        {/* Add other fields as needed */}
                    </Form>
                </Modal>
            )}
        </DefaultLayout>
    );
};

export default Profomas;
