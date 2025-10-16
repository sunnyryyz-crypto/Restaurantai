#!/usr/bin/env python3
"""
Flask app runner for Primary Q-Bank
"""

from app import create_app

if __name__ == '__main__':
    app = create_app()
    print("Starting Primary Q-Bank server...")
    print("Access the Q-Bank at: http://localhost:5000")
    print("Q-Bank API endpoints available at: http://localhost:5000/qbank/")
    app.run(debug=True, host='0.0.0.0', port=5000)
