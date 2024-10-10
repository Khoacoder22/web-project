import React, { useState } from 'react';
import Card from '../component/Productcard';
import { Modal, Input, Button } from 'antd';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import './shop.css';
import SearchBar from '../component/SearchBar';

const Shop = () => {
  const { products, createProduct } = useProducts(); // Lấy products và createProduct từ context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const { isAdmin } = useAuth();
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Thêm state cho kết quả tìm kiếm

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm(); 
  };

  const resetForm = () => {
    setProductName('');
    setProductPrice('');
    setProductDescription('');
  };

  const handleSubmit = () => {
    const newProduct = {
      name: productName,
      price: productPrice,
      description: productDescription,
    };
    createProduct(newProduct); // Sử dụng createProduct để thêm sản phẩm vào context
    closeModal();
  };

  // Hàm xử lý kết quả tìm kiếm
  const handleSearch = (query) => {
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredProducts);
  };

  // Hiển thị sản phẩm: Nếu có kết quả tìm kiếm, ưu tiên hiển thị sản phẩm tìm kiếm trước
  const displayedProducts = searchResults.length > 0 ? searchResults : products;

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: 'white' }}>Welcome to the Shop</h1>
      {isAdmin && 
      <Button type="primary" onClick={openModal} style={{ marginBottom: '20px', color:'white', fontWeight:'bold'}}>
        <label>Add New Product</label>
      </Button>
      }
      {/* Modal thêm sản phẩm mới */}
      <Modal title="Add New Product" open={isModalOpen} onCancel={closeModal} footer={null}>
        <label>Product Name</label>
        <Input 
          placeholder="Enter product name" 
          value={productName} 
          onChange={(e) => setProductName(e.target.value)} 
          style={{ marginBottom: '10px' }} 
        />
        <label>Product Price</label>
        <Input 
          placeholder="Enter product price" 
          value={productPrice} 
          onChange={(e) => setProductPrice(e.target.value)} 
          style={{ marginBottom: '10px' }} 
        />
        <label>Product Description</label>
        <Input 
          placeholder="Enter product description" 
          value={productDescription} 
          onChange={(e) => setProductDescription(e.target.value)} 
          style={{ marginBottom: '10px' }} 
        />
        <div className='button_holder' style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button className='closebtn' onClick={closeModal}>
            <label>Close</label>
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            <label>Submit</label>
          </Button>
        </div>
      </Modal>
      <br></br>
      <br></br>
      {/* Sử dụng Flexbox để căn giữa thanh search bar */}
      <div className="searchbar-container">
        <SearchBar onSearch={handleSearch} /> {/* Truyền hàm handleSearch vào SearchBar */}
      </div>
      <div className="card-container">
        {displayedProducts.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
