package com.bookshop.services;

import com.bookshop.entities.CartItem;
import com.bookshop.entities.Product;
import com.bookshop.repositories.CartRepository;
import com.bookshop.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    // Lấy tất cả sản phẩm
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Lấy sản phẩm theo thứ tự tăng dần của giá
    public List<Product> getProductsSortedByPriceAsc() {
        return productRepository.findAllByOrderByPriceAsc();
    }

    // Lấy sản phẩm theo thứ tự giảm dần của giá
    public List<Product> getProductsSortedByPriceDesc() {
        return productRepository.findAllByOrderByPriceDesc();
    }

    // Tạo sản phẩm mới
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Cập nhật sản phẩm và đồng bộ với CartItem
    @Transactional
    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setPrice(updatedProduct.getPrice());
            Product savedProduct = productRepository.save(product);

            // Đồng bộ cập nhật sản phẩm trong các CartItem liên quan
            List<CartItem> cartItems = cartRepository.findByProductId(id);
            for (CartItem cartItem : cartItems) {
                cartItem.setProduct(savedProduct);
                cartRepository.save(cartItem);
            }
            return savedProduct;
        }).orElse(null);
    }

    // Xóa sản phẩm và các mục CartItem liên quan
    @Transactional
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            List<CartItem> cartItems = cartRepository.findByProductId(id);
            cartRepository.deleteAll(cartItems);
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Tìm sản phẩm theo ID
    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    // Lưu sản phẩm sau khi tải lên hoặc cập nhật
    public Product save(Product product) {
        return productRepository.save(product);
    }

    // Tìm kiếm sách theo từ khóa
    public List<Product> searchBooks(String query) {
        return productRepository.findByNameContainingIgnoreCase(query);
    }
}
