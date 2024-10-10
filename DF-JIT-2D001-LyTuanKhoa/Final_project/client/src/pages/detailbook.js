import React from 'react';
import { useParams } from 'react-router-dom';
import './detailbook.css'; 
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const DetailBook = () => {
  const { id } = useParams(); // Lấy id từ URL
  const { products } = useProducts(); // Lấy danh sách sản phẩm từ ProductContext
  const { addToCart } = useCart(); // Lấy hàm addToCart từ CartContext
  
  // Tìm sản phẩm tương ứng với id
  const product = products.find(p => p.id === parseInt(id));
  
  if (!product) {
    return <p>Book not found!</p>;
  }

  // Hàm thêm sản phẩm vào giỏ hàng
  const handleAddedToCart = () => {
    console.log("Product added:", product); // Kiểm tra giá trị của product
    if (product) {
      addToCart(product);
      toast.success(`Product ${product.name} has been added to your cart`);
    } else {
      toast.error("Product not found");
    }
  };

  console.log(product.image);

  return (
    <div className="detail-book-container">
      <div className="image-section">
        <img
          alt={product.name}
          src={product.image || "https://m.media-amazon.com/images/I/71sVQDj0SCL._AC_UF1000,1000_QL80_.jpg"}
          className="book-image"
        />
      </div>
      <div className="info-section">
        <h1 className="book-title" style={{color:'white'}}>{product.name}</h1>
        <p className="book-price" style={{color:'white'}}><strong>Price:</strong> ${product.price}</p>
        <p className="book-description" style={{color:'white'}}><strong>Description:</strong> {product.description}</p>
      </div>
      <div className='content'>
        <button type="button" style={{marginTop:'12px', marginLeft:"400px"}} onClick={handleAddedToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default DetailBook;
