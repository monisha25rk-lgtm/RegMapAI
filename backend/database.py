from db import get_connection

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    print("Syncing database schema with existing MySQL tables...")
    
    # Disable foreign key checks to allow dropping tables in correct order
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
    cursor.execute("DROP TABLE IF EXISTS auditlogs")
    cursor.execute("DROP TABLE IF EXISTS evidence")
    cursor.execute("DROP TABLE IF EXISTS maps")
    cursor.execute("DROP TABLE IF EXISTS circulars")
    cursor.execute("DROP TABLE IF EXISTS users")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
    
    # 1. circulars Table
    cursor.execute("""
        CREATE TABLE circulars (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            issuer VARCHAR(255),
            upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            source VARCHAR(255),
            text_content LONGTEXT,
            authenticity_status VARCHAR(50)
        ) ENGINE=InnoDB
    """)
    
    # 2. users Table
    cursor.execute("""
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE,
            password_hash VARCHAR(255),
            role VARCHAR(50),
            department VARCHAR(100)
        ) ENGINE=InnoDB
    """)

    # 3. maps Table
    cursor.execute("""
        CREATE TABLE maps (
            id INT AUTO_INCREMENT PRIMARY KEY,
            circular_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            department VARCHAR(100),
            owner VARCHAR(100),
            deadline DATE,
            priority VARCHAR(20),
            compliance_score INT,
            risk_score INT,
            risk_reason TEXT,
            status VARCHAR(50),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_map_circular FOREIGN KEY (circular_id) 
            REFERENCES circulars(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    """)
    
    # 4. evidence Table
    cursor.execute("""
        CREATE TABLE evidence (
            id INT AUTO_INCREMENT PRIMARY KEY,
            map_id INT NOT NULL,
            file_path VARCHAR(500),
            file_name VARCHAR(255),
            upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            validation_result VARCHAR(50),
            validation_reason TEXT,
            compliance_score INT,
            needs_manual_verification BOOLEAN DEFAULT FALSE,
            manual_verification_status VARCHAR(50),
            CONSTRAINT fk_evidence_map FOREIGN KEY (map_id) 
            REFERENCES maps(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    """)
    
    # 5. auditlogs Table
    cursor.execute("""
        CREATE TABLE auditlogs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            module VARCHAR(50),
            action VARCHAR(100),
            details TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_audit_user FOREIGN KEY (user_id) 
            REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB
    """)
    
    conn.commit()
    cursor.close()
    conn.close()
    print("Database schema successfully synchronized.")

if __name__ == "__main__":
    init_db()
