package com.example.kiosk.product;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ProductMapper {
    List<Product> findAll();

    Product findByName(@Param("name") String name);

    Integer findProductIdByName(@Param("name") String name);

    Integer getPriceByProductName(@Param("name") String name);

    void insert(Product product);

    void update(Product product);

    void delete(@Param("productId") int productId);
}
