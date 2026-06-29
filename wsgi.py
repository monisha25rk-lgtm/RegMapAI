import sys
import os

# Add the backend directory to the system path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Import the app from the backend/app.py
from app import app as application

if __name__ == "__main__":
    application.run()
