import unittest
import json
import os
from backend.app import app, DATA_FILE

class TestAssetManager(unittest.TestCase):

    # This runs before every single test to give us a clean environment
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        
        # Start with a clean sample asset array for testing
        sample_data = [
            {"name": "Test Laptop", "serial": "SN-TEST-111", "status": "Available"}
        ]
        with open(DATA_FILE, 'w') as f:
            json.dump(sample_data, f)

    # Clean up the file after tests finish running
    def tearDown(self):
        if os.path.exists(DATA_FILE):
            os.remove(DATA_FILE)

    # 1. TEST GET ROUTE
    def test_get_assets(self):
        response = self.app.get('/api/assets')
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['serial'], 'SN-TEST-111')

    # 2. TEST POST ROUTE (SUCCESS)
    def test_add_asset_success(self):
        new_device = {"name": "Test Phone", "serial": "SN-TEST-222", "status": "In Stock"}
        response = self.app.post('/api/assets', 
                                 data=json.dumps(new_device), 
                                 content_type='application/json')
        self.assertEqual(response.status_code, 201)

    # 3. TEST POST ROUTE (VALIDATION / DUPLICATE BLOCK)
    def test_add_asset_duplicate(self):
        duplicate_device = {"name": "Test Laptop", "serial": "SN-TEST-111", "status": "Available"}
        response = self.app.post('/api/assets', 
                                 data=json.dumps(duplicate_device), 
                                 content_type='application/json')
        # Expecting a 400 Bad Request because of our new validation logic
        self.assertEqual(response.status_code, 400)

    # 4. TEST DELETE ROUTE
    def test_delete_asset(self):
        response = self.app.delete('/api/assets/SN-TEST-111')
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()