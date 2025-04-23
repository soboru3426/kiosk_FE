package com.example.kiosk.product;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductMapper productMapper;

    public List<Product> getAllProducts() {
        return productMapper.findAll();
    }

    public Product findByName(String name) {
        return productMapper.findByName(name);
    }

    public Integer getProductIdByName(String name) {
        return productMapper.findProductIdByName(name);
    }

    public int getPriceByName(String name) {
        return productMapper.getPriceByProductName(name);
    }

    public void addProduct(Product product) {
        productMapper.insert(product);
    }

    public void updateProduct(Product product) {
        productMapper.update(product);
    }

    public void deleteProduct(int productId) {
        productMapper.delete(productId);
    }
}
