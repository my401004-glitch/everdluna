# web_init.py - Initial Setup Script
import os
import json
from dotenv import load_dotenv

load_dotenv()

def initialize_project():
    """Initializes the project environment setup."""
    print("--- Project Initialization Started ---")
    
    # 1. Load configuration
    try:
        with open('config.env', 'r') as f:
            config = dict(line.strip().split('=', 1) for line in f.readlines())
        print("[INFO] Configuration loaded successfully.")
        
        # 2. Check API Key existence (Basic Validation)
        if not config.get('API_KEY'):
            raise ValueError("API_KEY is missing from config.env.")

        # 3. Database Connection Check (Placeholder for actual DB setup later)
        print("[INFO] Database connection string loaded.")

    except FileNotFoundError as e:
        print(f"[ERROR] Configuration file not found: {e}")
        return False
    except ValueError as e:
        print(f"[FATAL] Configuration validation failed: {e}")
        return False
    except Exception as e:
        print(f"[CRITICAL] An unexpected error occurred during initialization: {e}")
        return False

    # 4. API Linkage Check Placeholder (To be expanded)
    print("[INFO] API linkage setup initiated. Further API endpoint validation to follow.")
    
    print("--- Project Initialization Complete ---")
    return True

if __name__ == "__main__":
    initialize_project()