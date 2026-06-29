from db import get_connection
import hashlib

def seed_users():
    users = [
        # Executives
        ("Aditi Bose", "aditi.bose@regmap.ai", "Executive", "Executive"),
        ("Arjun Khanna", "arjun.khanna@regmap.ai", "Executive", "Executive"),
        
        # Department Heads
        ("Priya Shah", "priya.shah@regmap.ai", "Department Head", "Compliance"),
        ("Rohit Verma", "rohit.verma@regmap.ai", "Department Head", "IT"),
        ("Ananya Singh", "ananya.singh@regmap.ai", "Department Head", "Risk"),
        ("Neha Patel", "neha.patel@regmap.ai", "Department Head", "Legal"),
        
        # Audit
        ("Vikram Malhotra", "vikram.malhotra@regmap.ai", "Audit Officer", "Audit"),
        
        # Staff
        ("Suresh Kumar", "suresh.kumar@regmap.ai", "Staff", "IT"),
        ("Meera Reddy", "meera.reddy@regmap.ai", "Staff", "Compliance")
    ]
    
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Optional: Clear existing users to avoid duplicates if needed
        # cursor.execute("DELETE FROM users")
        
        query = "INSERT INTO users (name, email, password_hash, role, department) VALUES (%s, %s, %s, %s, %s)"
        
        for name, email, role, dept in users:
            # Check if user exists
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                print(f"User {email} already exists, skipping.")
                continue
                
            pwd_hash = hashlib.sha256("password123".encode()).hexdigest()
            cursor.execute(query, (name, email, pwd_hash, role, dept))
            print(f"Seeded user: {name} ({role})")
            
        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Seeding complete.")
    except Exception as e:
        print(f"❌ Seeding Error: {e}")

if __name__ == "__main__":
    seed_users()
