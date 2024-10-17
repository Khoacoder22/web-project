import { Button, DatePicker, Form, Input, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './check.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment'; // Thêm thư viện moment để xử lý ngày tháng

const Checkout = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { cart, setCart, orders, setOrders } = useCart();
  const { username, authHeader } = useAuth();
  const navigate = useNavigate();
  const [isNavigatedFromCart, setIsNavigatedFromCart] = useState(false);
  const initialCheckDoneRef = useRef(false);

  // Kiểm tra xem người dùng có điều hướng từ giỏ hàng không
  useEffect(() => {
    if (!initialCheckDoneRef.current) {
      const navigatedFromCart = localStorage.getItem('navigatedFromCart');
      if (cart.length === 0 || navigatedFromCart !== 'true') {
        navigate('/cart');
      } else {
        setIsNavigatedFromCart(true);
        localStorage.removeItem('navigatedFromCart');
      }
      initialCheckDoneRef.current = true;
    }
  }, [cart, navigate]);

  // Tính tổng giá trị đơn hàng
  const totalPrice = cart.reduce(
    (total, product) => total + (product.product.price || 0) * (product.quantity || 0),
    0
  );
  console.log('Total Price:', totalPrice); // Kiểm tra giá trị tổng

  // Hàm xử lý khi hoàn thành form thanh toán
  const handleFinish = async (values) => {
    const newOrder = {
      date: new Date().toLocaleString(), // Lấy thời gian hiện tại
      total: totalPrice, // Tính tổng tiền từ giỏ hàng
      username: username, // Lấy tên người dùng từ thông tin đăng nhập
      orderDetails: cart.map((item) => ({
        product: {
          id: item.product.id, // Lấy ID sản phẩm từ giỏ hàng
        },
        quantity: item.quantity, // Lấy số lượng sản phẩm từ giỏ hàng
      })),
    };

    try {
      const response = await axios.post('http://localhost:8080/api/orders', newOrder, {
        headers: { Authorization: authHeader },
      });

      if (response.status === 200) {
        const updatedOrders = [...orders, newOrder];
        setOrders(updatedOrders);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setCart([]); 
      
        toast.success('Payment completed successfully! Redirecting to shop...', {
          position: 'top-right',
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate('/shop');
        }, 3000);
      }
    } catch (error) {
      console.error('Error processing order:', error);
    }
  };

  const disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };

  return (
    <>
      <ToastContainer />
      {isNavigatedFromCart && (
        <Modal
          title="Enter Visa Information"
          open={true}
          onCancel={() => navigate('/cart')}
          footer={null}
          closable={false}
          width={500}
        >

          <div className="checkout-products">
            <h3>Products in your cart:</h3>
            <div className="product-list">
              {cart.map((item) => (
                <div key={item.product.id} className="product-item">
                  <img
                    src={item.product.image || 'https://via.placeholder.com/150'}
                    alt={item.product.name}
                    className="product-image"
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      marginRight: '10px',
                    }}
                  />
                  <div>
                    <p>
                      <strong>{item.product.name}</strong>
                    </p>
                    <p>Price: ${item.product.price || 0}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <p>
              <strong>Total Price: ${totalPrice}</strong>
            </p>
          </div>

          <Form className="checkoutform" layout="vertical" onFinish={handleFinish}>
            <Form.Item
              className="visa"
              label="Visa Card Number"
              name="cardNumber"
              rules={[
                { required: true, message: 'Please input your Visa card number!' },
                { min: 4, message: 'Card number must be at least 4 digits!' }, 
              ]}
            >
              <Input placeholder="Enter card number" maxLength={16} />
            </Form.Item>
            <Form.Item
              label="Expiration Date"
              name="expirationDate"
              rules={[{ required: true, message: 'Please input the expiration date!' }]}
            >
              <DatePicker
                format="MM/YY"
                picker="month"
                placeholder="Select expiration date"
                style={{ width: '100%' }}
                disabledDate={disabledDate} 
              />
            </Form.Item>
            <Button style={{ width: '300px' }} type="primary" htmlType="submit">
             <label>Submit</label> 
            </Button>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default Checkout;
