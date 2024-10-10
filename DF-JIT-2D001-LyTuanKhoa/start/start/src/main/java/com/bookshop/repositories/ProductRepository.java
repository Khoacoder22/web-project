package com.bookshop.repositories;

import com.bookshop.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Phương thức tìm kiếm sách theo tên
    List<Product> findByNameContaining(String name);
}
