import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

const initializeProducts = () => {
    const storedProducts = JSON.parse(localStorage.getItem('products'));
    // Kiểm tra sản phẩm có id không trước khi khởi tạo từ localStorage
    if (storedProducts && storedProducts.every(p => p.id)) { 
        return storedProducts;
    } else {
        const defaultProducts = [];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
        return defaultProducts;
    }
};

export const ProductProvider = ({ children }) => {
    const { authHeader } = useAuth();
    const [products, setProducts] = useState(initializeProducts());
    const [subscribers, setSubscribers] = useState([]); // Khởi tạo subscribers cho onProductChange

    useEffect(() => {
        // Cập nhật localStorage mỗi khi products thay đổi
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    // Tạo sản phẩm mới
    const createProduct = async (product) => {
        try {
            // Không cần truyền id khi tạo sản phẩm mới
            const newProduct = {
                name: product.name,
                price: product.price,
                description: product.description
            };

            // Gửi yêu cầu tạo sản phẩm
            const response = await axios.post('http://localhost:8080/api/products', newProduct, {
                headers: {
                    Authorization: authHeader,
                },
            });

            // Thêm sản phẩm mới trả về từ server (có id) vào state
            setProducts((prevProducts) => [...prevProducts, response.data]); 
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    // Chỉnh sửa sản phẩm
    const editProduct = async (updatedProduct) => {
        try {
            // Đảm bảo product có id
            if (!updatedProduct.id) {
                throw new Error('Product ID is missing');
            }

            // Gửi yêu cầu chỉnh sửa sản phẩm
            const response = await axios.put(`http://localhost:8080/api/products/${updatedProduct.id}`, updatedProduct, {
                headers: {
                    Authorization: authHeader,
                },
            });

            // Cập nhật lại product trong state
            setProducts((prevProducts) => 
                prevProducts.map((p) => (p.id === updatedProduct.id ? response.data : p))
            );
        } catch (error) {
            console.error('Error editing product:', error);
        }
    };

    // Xóa sản phẩm
    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/products/${id}`, {
                headers: {
                    Authorization: authHeader,
                },
            });

            // Xóa sản phẩm khỏi state
            setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // Hàm để subscribe các thay đổi sản phẩm
    const onProductChange = useCallback((callback) => {
        setSubscribers((prevSubscribers) => {
            if (!prevSubscribers.includes(callback)) {
                return [...prevSubscribers, callback];
            }
            return prevSubscribers;
        });
    }, []);

    return (
        <ProductContext.Provider value={{ products, createProduct, editProduct, deleteProduct, onProductChange }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);
