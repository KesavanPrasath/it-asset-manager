import unittest
import json
from app import app, DATA_FILE

class TestAssetManagerAPI(unittest.TestCase):

    def setUp(self):
        # Fresh initialization before starting individual test runs
        with open(DATA_FILE, 'w') as file:
            json.dump([], file)
        self.client = app.test_client()

    def test_crud_lifecycle_workflow(self):
        # 1. Test POST endpoint configuration
        new_item = {"name": "Lab Monitor", "serial": "MON456", "status": "Available"}
        post_response = self.client.post('/api/assets', 
                                         data=json.dumps(new_item), 
                                         content_type='application/json')
        self.assertEqual(post_response.status_code, 201)

        # 2. Test GET extraction mechanics
        get_response = self.client.get('/api/assets')
        data = json.loads(get_response.data)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['serial'], 'MON456')

if __name__ == '__main__':
    unittest.main()