import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Modal, Button, Table, Card, Tag } from "antd";
import DefaultLayout from "../Components/DefaultLayout";
import logo from '../assets/zealtech.png';
import "../styles/InvoiceStyles.css";

const Invoices = () => {
    const componentRef = useRef();
    const dispatch = useDispatch();
    const [invoiceData, setInvoiceData] = useState([]);
    const [popupModal, setPopupModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // Function to fetch all invoices
    const getAllInvoices = async () => {
        try {
            dispatch({ type: "SHOW_LOADING" });
            const { data } = await axios.get("/api/invoices/get-invoice");
            setInvoiceData(data);
            dispatch({ type: "HIDE_LOADING" });
        } catch (error) {
            dispatch({ type: "HIDE_LOADING" });
            console.log(error);
        }
    };

    // Load invoices on component mount
    useEffect(() => {
        getAllInvoices();
    }, []);

    // Function to handle printing
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // Table columns configuration
    const columns = [
        {
            title: "Serial No",
            dataIndex: "serial",
            render: (text, record, index) => index + 1,
        },
        { title: "ID", dataIndex: "_id" },
        { title: "Invoice#", dataIndex: "invoiceNumber" },
        { title: "Customer Name", dataIndex: "customerName" },
        { title: "Contact No", dataIndex: "customerNumber" },
        { title: "Subtotal(Tshs)", dataIndex: "subTotal", render: (subTotal) => subTotal.toLocaleString(), },
        { title: "VAT", dataIndex: "tax", render: (tax) => tax.toLocaleString(), },
        { title: "Total Amount(Tshs)", dataIndex: "totalAmount", render: (totalAmount) => totalAmount.toLocaleString(), },
        {
            title: "Status",
            dataIndex: "status",
            render: (status, record) => (
                <Tag color={status === 'pending' ? 'orange' : 'green'} onClick={() => handleStatusChange(record._id)}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "Actions",
            dataIndex: "_id",
            render: (id, record) => (
                <EyeOutlined
                    style={{ cursor: "pointer", color: 'green' }}
                    onClick={() => {
                        setSelectedInvoice(record);
                        setPopupModal(true);
                    }}
                />
            ),
        },
    ];

    // Function to handle status change
    const handleStatusChange = async (invoiceId) => {
        try {
            // Make API call to update the status
            await axios.put(`/api/invoices/${invoiceId}/status`, { status: 'paid' });
            // Refresh invoices after status change
            getAllInvoices();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <DefaultLayout>
            <Card
                title="Invoice List"
                style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', background: '#f0f2f5' }}
                headStyle={{ background: '#000', color: '#fff', fontWeight: 'bold', fontSize: '25px' }} >

                <Table columns={columns} dataSource={invoiceData} bordered rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    style={{ marginBottom: '16px' }} />
            </Card>

            {/* Modal to display invoice details */}
            {popupModal && (
                <Modal
                    width={900}
                    pagination={false}
                    title="Invoice Details"
                    visible={popupModal}
                    onCancel={() => setPopupModal(false)}
                // footer={[
                //     <Button key="print" type="primary" onClick={handlePrint}>
                //         Print
                //     </Button>,
                //     <Button key="close" onClick={() => setPopupModal(false)}>
                //         Close
                //     </Button>,
                // ]}
                >
                    <div ref={componentRef} className="invoice-container print-view">
                        <center id="top">
                            <div className="logo" >
                                <img className="logo" src={logo} alt="logo" />
                            </div>
                            <div className="info">
                                <h2><b>ZealTech Company Ltd</b></h2>
                                <p> P.O. BOX 38036, Dar es salaam,Tanzania| Victoria New Bagamoyo Road Plot39A Block205 (Old BMTL House) 2nd floor.<br />
                                    Call Us: +255719100800 & +255747262626<br />www.zealtechtz.com | sales@zealtechtz.com<br />
                                    <b>TIN: 140-985-538 , VRN: 40-314371-L</b></p>

                            </div>
                        </center>
                        <div className="profoma-details">
                            <div className="mt-2">
                                <p> Invoice# : <b>{selectedInvoice.invoiceNumber}</b>
                                    <br />
                                    Customer Name : <b>{selectedInvoice.customerName}</b>
                                    <br />
                                    Phone No : <b>{selectedInvoice.customerNumber}</b>
                                    <br />
                                    Customer TIN: <b>{selectedInvoice.customerTin}</b>
                                    <br />
                                    Date : <b>{selectedInvoice.date ? new Date(selectedInvoice.date).toLocaleDateString() : ""}</b>
                                    <br />
                                    {/* Due Date: <b>{selectedInvoice.dueDate}</b> */}
                                </p>
                                <hr style={{ margin: "5px" }} />
                            </div>
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
                                    {selectedInvoice.cartItems.map((item, index) => (
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
                                        <td><b>{selectedInvoice.subTotal.toLocaleString()}</b></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4"></td>
                                        <td><b>VAT:</b></td>
                                        <td><b>{selectedInvoice.tax.toLocaleString()}</b></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4"></td>
                                        <td><b>Total VAT Incl:</b></td>
                                        <td><b>{selectedInvoice.totalAmount.toLocaleString()}</b></td>
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
        </DefaultLayout>
    );
};

export default Invoices;
