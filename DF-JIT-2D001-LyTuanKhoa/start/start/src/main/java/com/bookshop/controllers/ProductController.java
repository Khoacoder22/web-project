package com.bookshop.controllers;

import com.bookshop.entities.Product;
import com.bookshop.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // API lấy danh sách sản phẩm với tính năng sắp xếp theo giá và tìm kiếm
    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "query", required = false) String query) {

        List<Product> products;

        // Kiểm tra có từ khóa tìm kiếm không
        if (query != null && !query.isEmpty()) {
            products = productService.searchBooks(query);
        } else {
            // Kiểm tra tham số "sort" và sắp xếp theo giá
            if ("asc".equalsIgnoreCase(sort)) {
                products = productService.getProductsSortedByPriceAsc();
            } else if ("desc".equalsIgnoreCase(sort)) {
                products = productService.getProductsSortedByPriceDesc();
            } else {
                products = productService.getAllProducts();
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(products);
    }

    // API tạo sản phẩm mới
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    // API cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<Product> editProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Product savedProduct = productService.updateProduct(id, updatedProduct);
        if (savedProduct != null) {
            return ResponseEntity.status(HttpStatus.OK).body(savedProduct);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // API xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        boolean isDeleted = productService.deleteProduct(id);
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Product deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
    }

    // API tìm kiếm sách theo từ khóa
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchBooks(@RequestParam("query") String query) {
        List<Product> products = productService.searchBooks(query);
        return ResponseEntity.status(HttpStatus.OK).body(products);
    }
}
