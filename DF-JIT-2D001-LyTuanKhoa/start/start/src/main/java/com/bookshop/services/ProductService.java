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

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Product updatedProduct) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            product.setName(updatedProduct.getName());
            product.setPrice(updatedProduct.getPrice());
            product = productRepository.save(product);

            List<CartItem> cartItems = cartRepository.findByProductId(id);
            for (CartItem cartItem : cartItems) {
                cartItem.setProduct(product);
                cartRepository.save(cartItem);
            }
            return product;
        }
        return null;
    }

    @Transactional
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            List<CartItem> cartItems = cartRepository.findByProductId(id);
            for (CartItem cartItem : cartItems) {
                cartRepository.delete(cartItem);
            }

            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Thêm phương thức upload hình ảnh
    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public List<Product> searchBooks(String query) {
        return productRepository.findByNameContaining(query);
    }
}
