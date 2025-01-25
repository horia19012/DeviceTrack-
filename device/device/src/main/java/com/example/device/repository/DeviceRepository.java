package com.example.device.repository;

import com.example.device.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device,Long> {
    List<Device> findByUserId(Long userId);

    @Query("SELECT d.id FROM Device d")
    List<Long> findAllIds();
    void deleteByUserId(Long userId);
}
