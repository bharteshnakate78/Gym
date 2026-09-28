package com.example.gymback.repository;

import com.example.gymback.entity.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GalleryRepository
        extends JpaRepository<Gallery,Long>{

}