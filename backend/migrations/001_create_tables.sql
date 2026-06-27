-- ProcureHub Database Schema
-- Run: mysql -u root -p < migrations/001_create_tables.sql

CREATE DATABASE IF NOT EXISTS procurehub;
USE procurehub;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    role ENUM('procurement_manager', 'vendor') NOT NULL,
    session_token VARCHAR(500) DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- PURCHASE ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS purchase_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manager_id INT NOT NULL,
    item_description VARCHAR(500) NOT NULL,
    quantity INT NOT NULL,
    target_delivery_date DATE NOT NULL,
    status ENUM('open_for_bids', 'awarded', 'closed') NOT NULL DEFAULT 'open_for_bids',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- BIDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    po_id INT NOT NULL,
    vendor_id INT NOT NULL,
    bid_amount DECIMAL(12, 2) NOT NULL,
    promised_delivery_days INT NOT NULL,
    status ENUM('submitted', 'accepted', 'rejected') NOT NULL DEFAULT 'submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_po_manager ON purchase_orders(manager_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_bid_po ON bids(po_id);
CREATE INDEX idx_bid_vendor ON bids(vendor_id);
CREATE INDEX idx_bid_status ON bids(status);
