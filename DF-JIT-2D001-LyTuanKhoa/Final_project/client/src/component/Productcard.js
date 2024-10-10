import React, { useState } from 'react';
import './Card.css';
import { Form, Upload, Modal, Input, Button } from "antd";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';


const Card = ({ product }) => {
  const { addToCart } = useCart();
  const { editProduct, deleteProduct } = useProducts();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditOpen] = useState(false);

  // Kiểm tra xem ảnh đã lưu trong localStorage hay chưa
  const localImage = localStorage.getItem(`product_image_${product.id}`);
  const [image, setImage] = useState(localImage || product.image || '');

  const [editProductInfo, setEditProductInfo] = useState({
    product: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image
  });

  const { isAdmin } = useAuth();
  const [form] = Form.useForm(); // Khởi tạo form từ Ant Design

  const openDetailModal = () => setDetailModalOpen(true);
  const closeDetailModal = () => setDetailModalOpen(false);

  const openEditModal = () => {
    setEditOpen(true);
    form.setFieldsValue(editProductInfo); // Đặt giá trị hiện tại của sản phẩm vào form
  };
  const closeEditModal = () => setEditOpen(false);

  const handleUpload = async (info) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target.result; // Đây là dữ liệu Base64
      try {
        // Lưu Base64 vào localStorage với key product_image_{product.id}
        localStorage.setItem(`product_image_${product.id}`, base64Image);

        toast.success("Image uploaded successfully");
        setImage(base64Image); // Cập nhật hình ảnh trong UI
      } catch (error) {
        const message = error.response ? error.response.data.message : 'Unknown error';
        toast.error(`Failed to upload image: ${message}`);
      }
    };
    reader.readAsDataURL(info.file); // Chuyển file ảnh thành Base64
  };

  const handleAddedToCart = () => {
    if (product && product.id) {
        addToCart(product); // Gọi hàm addToCart từ CartContext
        toast.success(`Product ${product.name} has been added to your cart`);
    } else {
        toast.error('Product data is invalid');
    }
};

  const handleEdit = (values) => {
    // Cập nhật trạng thái `editProductInfo` với giá trị từ form
    const updatedProduct = { ...editProductInfo, ...values, image };

    // Gọi hàm `editProduct` với giá trị đã cập nhật
    editProduct({ id: product.id, ...updatedProduct });

    // Lưu lại hình ảnh sau khi chỉnh sửa
    localStorage.setItem(`product_image_${product.id}`, image);

    // Cập nhật lại UI bằng cách thay đổi `editProductInfo` và `product`
    setEditProductInfo(updatedProduct);
    closeEditModal();
  };

  const handleDelete = () => {
    deleteProduct(product.id);
    localStorage.removeItem(`product_image_${product.id}`); // Xóa ảnh khỏi localStorage
    toast.success(`Product ${product.name} has been deleted`);
  };

  return (
    <div className="card">
      <img
        alt={product.name}
        src={image ? image : "https://m.media-amazon.com/images/I/71sVQDj0SCL._AC_UF1000,1000_QL80_.jpg"}
        onClick={openDetailModal}
        style={{ width: '100%', objectFit: 'cover' }}
      />

      <div className="card-body">
        <h1 className="card-title">{editProductInfo.name}</h1>
        <p className="card-info">{editProductInfo.description || 'No description available.'}</p>

        {!isAdmin && (
          <>
            <button className="card-btn" onClick={handleAddedToCart}>Add to Cart</button>
            <Link to={`/book/${product.id}`}>
              <button className='card-btn' style={{ marginTop: '3px' }}>Details</button>
            </Link>
          </>
        )}
        {isAdmin && (
          <>
            <button className="card-btn" onClick={openEditModal}>Edit Product</button>
            <button className="card-btn" onClick={handleDelete}>Delete</button>

            <Upload
              className='image_button'
              name="image"
              showUploadList={false}
              beforeUpload={() => false}
              style={{ marginTop: '3px' }}
              onChange={handleUpload}
            >
              <button className="card-btn">Upload Image</button>
            </Upload>

            <button className='card-btn' onClick={openDetailModal} style={{ marginTop: '3px' }}>Details</button>
          </>
        )}
      </div>

      <Modal
        title="Product Details"
        visible={detailModalOpen}
        onCancel={closeDetailModal}
        footer={null}
      >
        <h2>{editProductInfo.name}</h2>
        <img
          alt={editProductInfo.name}
          src={image ? image : "https://m.media-amazon.com/images/I/71sVQDj0SCL._AC_UF1000,1000_QL80_.jpg"}
          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
        />
        <p>{editProductInfo.description || 'No description available.'}</p>
        <p>Price: {editProductInfo.price}</p>
      </Modal>

      {isAdmin && (
        <Modal
          title="Edit Product"
          visible={editModalOpen}
          onCancel={closeEditModal}
          footer={null}
        >
          <Form form={form} onFinish={handleEdit} layout="vertical">
            <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Product Price" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="description" label="Product Description">
              <Input.TextArea />
            </Form.Item>
            <Button type="primary" htmlType="submit">Save</Button>
          </Form>
        </Modal>
      )}

      <ToastContainer />
    </div>
  );
};

export default Card;
