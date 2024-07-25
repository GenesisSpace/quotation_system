import React from "react";
import { Button, Card } from "antd";
import { useDispatch } from "react-redux";

const ItemList = ({ items }) => {
  const dispatch = useDispatch();

  // Update cart handler
  const handleAddToCart = (item) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, quantity: 1 },
    });
  };

  const { Meta } = Card;

  // Check if items is defined before slicing
  const recentItems = items ? items.slice(0, 3) : [];

  return (
    <div>
      {recentItems.map((item) => (
        <Card
          key={item.id} // Assuming each item has a unique identifier like 'id'
          style={{ width: 80, marginBottom: 20 }}
          cover={<img alt={item.name} src={item.image} style={{ height: 50 }} />}
        >
          <Meta title={item.name} />
          <div className="item-button">
            <Button onClick={() => handleAddToCart(item)}>Add to cart</Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ItemList;
