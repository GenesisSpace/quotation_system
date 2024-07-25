import React, { useEffect, useState } from 'react';
import DefaultLayout from '../Components/DefaultLayout';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Table, Modal, Form, Input, Select, message, Upload, Card } from "antd";


const Itempage = () => {
    const [itemData, setItemData] = useState([]);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const [popupModalVisible, setPopupModalVisible] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const { cartItems } = useSelector(state => state.rootReducer)

    const getAllItems = async () => {
        try {
            dispatch({ type: "SHOW_LOADING" });
            const { data } = await axios.get("/api/items/get-items");
            setItemData(data);
            dispatch({ type: "HIDE_LOADING" });
        } catch (error) {
            dispatch({ type: "HIDE_LOADING" });
            console.log(error);
            setError("An error occurred while fetching data.");
        }
    };

    useEffect(() => {
        getAllItems();
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }, [cartItems]);

    const handleAddToCart = (item) => {
        dispatch({
            type: "ADD_TO_CART",
            payload: { ...item, quantity: 1 },
        });
        navigate('/cart');
    };

    const handleDelete = async (record) => {
        Modal.confirm({
            title: 'Confirm Delete',
            content: 'Are you sure you want to delete this item?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    dispatch({ type: "SHOW_LOADING" });
                    await axios.delete("/api/items/delete-items", { data: { itemId: record._id } });
                    message.success('Item Deleted Successfully');
                    getAllItems();
                    dispatch({ type: "HIDE_LOADING" });
                } catch (error) {
                    message.error('Oops! Something went wrong');
                    console.log(error);
                    setError("An error occurred while deleting an item.");
                }
            },
        });
    };

    const columns = [
        { title: "Name", dataIndex: "name", style: { whiteSpace: 'nowrap' } },
        // { title: "Image", dataIndex: "image", render: (image, record) => (<img src={image} alt={record.name} height="60" width="60" />), style: { whiteSpace: 'nowrap' }, },
        { title: "Description", dataIndex: "description", render: (description) => <div style={{ maxWidth: '200px', wordWrap: 'break-word' }}>{description}</div> },
        { title: "Price(Tshs)", dataIndex: "price", style: { whiteSpace: 'nowrap' }, },
        {
            title: "Actions", dataIndex: "_id", render: (id, record) => (
                <div>
                    <EditOutlined
                        style={{ cursor: "pointer", marginRight: 8, color: 'orange' }}
                        onClick={() => {
                            setEditItem(record)
                            setPopupModalVisible(true)
                        }} />
                    <DeleteOutlined
                        style={{ cursor: "pointer", marginRight: 8, color: 'red' }}
                        onClick={() => {
                            handleDelete(record);
                        }} />
                    <ShoppingCartOutlined
                        style={{ cursor: "pointer", marginRight: 8, color: 'green' }}
                        onClick={() => handleAddToCart(record)}
                    />
                </div>
            ), style: { whiteSpace: 'nowrap' }
        },
    ];

    //Handle submit
    const handleSubmit = async (values) => {
        if (editItem === null) {
            try {
                dispatch({ type: "SHOW_LOADING" });
                const res = await axios.post("/api/items/add-items", values);
                message.success('Item Added Successfully');
                getAllItems();
                setPopupModalVisible(false);
                dispatch({ type: "HIDE_LOADING" });
            } catch (error) {
                message.error('Oops! Something went wrong');
                console.log(error);
                setError("An error occurred while adding item.");
            }
        } else {
            try {
                dispatch({ type: "SHOW_LOADING" });
                await axios.put("/api/items/edit-items", { ...values, itemId: editItem._id });
                message.success('Item Updated Successfully');
                getAllItems();
                setPopupModalVisible(false);
                dispatch({ type: "HIDE_LOADING" });
            } catch (error) {
                message.error('Oops! Something went wrong');
                console.log(error);
                setError("An error occurred while adding item.");
            }
        }
    };

    return (
        <DefaultLayout>
            <Card
                title="List of Items"
                style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', background: '#f0f2f5' }}
                headStyle={{ background: '#000', color: '#fff', fontWeight: 'bold', fontSize: '25px' }}>
                <div style={{ alignSelf: 'flex-end', marginTop: '10px', alignItems: 'flex-end' }} >
                    <Button type='primary' onClick={() => setPopupModalVisible(true)}>Add New Item</Button>
                </div>
                <div style={{ flex: '1' }} >
                    <Table columns={columns} dataSource={itemData} bordered rowKey="_id" />
                </div>

            </Card>


            {
                popupModalVisible && (
                    <Modal
                        title={`${editItem !== null ? "Edit Item " : "Add New Item"}`}
                        open={popupModalVisible}
                        onCancel={() => {
                            setEditItem(null);
                            setPopupModalVisible(false);
                        }}
                        footer={[
                            <Button key="cancel" onClick={() => setPopupModalVisible(false)}>Cancel</Button>,
                            <Button key="submit" type="primary" htmlType="submit" form="addItemForm">Save</Button>,
                        ]}
                    >
                        <Form id="addItemForm" layout="vertical" onFinish={handleSubmit}>
                            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the price!' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: 'Please input the Description!' }]}
                            >
                                <Input.TextArea rows={10} placeholder="Enter description" />
                            </Form.Item>

                            {/* <Form.Item name="image" label="Image Upload">
                                <Input onChange={(e) => setImage(e.target.files)} type='file' />
                            </Form.Item> */}
                            {/* <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select the category!' }]}>
                                <Select>
                                    <Select.Option value="drinks">Drinks</Select.Option>
                                    <Select.Option value="rice">Rice</Select.Option>
                                    <Select.Option value="noodles">Noodles</Select.Option>
                                </Select>
                            </Form.Item> */}
                        </Form>
                    </Modal>
                )
            }

            {error && <p>{error}</p>}
        </DefaultLayout>
    );
};

export default Itempage;
