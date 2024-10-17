import React, { useState } from 'react';
import Card from '../component/Productcard';
import { Modal, Input, Button, Form } from 'antd';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import './shop.css';
import SearchBar from '../component/SearchBar';

const Shop = () => {
  const { products, createProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // Khởi tạo form
  const { isAdmin } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false); // Trạng thái của dropdown

  // Hàm mở và đóng modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields(); // Reset các trường trong form
  };

  // Hàm xử lý khi submit sản phẩm mới
  const handleSubmit = (values) => {
    const newProduct = {
      name: values.productName,
      price: values.productPrice,
      description: values.productDescription,
    };
    createProduct(newProduct);
    closeModal();
  };

  // Hàm tìm kiếm sản phẩm
  const handleSearch = (query) => {
    let filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );

    // Sắp xếp theo giá nếu cần
    if (sortOrder === 'asc') {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    }

    setSearchResults(filteredProducts);
  };

  // Lựa chọn sản phẩm hiển thị
  const displayedProducts = searchResults.length > 0 ? searchResults : products;

  // Hàm thay đổi thứ tự sắp xếp
  const handleSortChange = (order) => {
    setSortOrder(order);
    setDropdownOpen(false); 
    handleSearch(''); // Tìm kiếm với thứ tự mới
  };

  // Hàm mở và đóng dropdown sắp xếp
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); 
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: 'white' }}>Welcome to the Shop</h1>

      {isAdmin && 
      <Button type="primary" onClick={openModal} style={{ marginBottom: '20px', color:'white', fontWeight:'bold'}}>
        <label>Add New Product</label>
      </Button>
      }

      {/* Modal thêm sản phẩm */}
      <Modal title="Add New Product" open={isModalOpen} onCancel={closeModal} footer={null}>
        <Form
          form={form}
          onFinish={handleSubmit} // Gọi hàm handleSubmit khi form được submit
          layout="vertical"
        >
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter the product name' }]} // Thêm validation
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            name="productPrice"
            label="Product Price"
            rules={[{ required: true, message: 'Please enter the product price' }]}
          >
            <Input type="number" placeholder="Enter product price" />
          </Form.Item>

          <Form.Item
            name="productDescription"
            label="Product Description"
            rules={[{ required: false, message: 'Please enter the product description' }]} 
          >
            <Input.TextArea placeholder="Enter product description" />
          </Form.Item>

          <div className='button_holder' style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button className='closebtn' onClick={closeModal}>
              <label>Close</label>
            </Button>
            <Button type="primary" htmlType="submit">
              <label>Submit</label>
            </Button>
          </div>
        </Form>
      </Modal>

      <br></br>
      <br></br>

      {/* Khu vực tìm kiếm và sắp xếp */}
      <div className="searchbar-container">
        <SearchBar onSearch={handleSearch} />
        <div className="sort-container" style={{ color: 'white', border:"1px solid gray", borderRadius:"40px", width:"200px"}}>
        <div className="dropdown">
          <button onClick={toggleDropdown} className="dropbtn">
            {sortOrder === 'asc' ? 'Low to High' : sortOrder === 'desc' ? 'High to Low' : 'Default'}
          </button>
          {dropdownOpen && (
            <ul className="dropdown-content" style={{ listStyle: 'none', padding: 0, backgroundColor:"gray", color:"white"}}>
              <li 
                onClick={() => handleSortChange('')} 
                style={{ cursor: 'pointer', padding: '5px', backgroundColor: sortOrder === '' ? '#ddd' : '' }}>
                Default
              </li>
              <li 
                onClick={() => handleSortChange('asc')} 
                style={{ cursor: 'pointer', padding: '5px', backgroundColor: sortOrder === 'asc' ? '#ddd' : '' }}>
                Low to High
              </li>
              <li 
                onClick={() => handleSortChange('desc')} 
                style={{ cursor: 'pointer', padding: '5px', backgroundColor: sortOrder === 'desc' ? '#ddd' : '' }}>
                High to Low
              </li>
            </ul>
          )}
        </div>
      </div>
      </div>

      {/* Khu vực hiển thị sản phẩm */}
      <div className="card-container">
        {displayedProducts.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
