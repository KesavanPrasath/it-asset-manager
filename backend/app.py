from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # This allows your frontend folder code to talk to your backend folder code safely

DATA_FILE = 'data.json'

# Helper function to read the current items from your database file
def read_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r') as file:
        return json.load(file)

# Helper function to overwrite your database file with fresh updates
def write_data(data):
    with open(DATA_FILE, 'w') as file:
        json.dump(data, file, indent=4)

# 1. READ ALL (GET method)
@app.route('/api/assets', methods=['GET'])
def get_assets():
    return jsonify(read_data()), 200

# 2. CREATE (POST method)
@app.route('/api/assets', methods=['POST'])
def add_asset():
    new_asset = request.json
    data = read_data()
    
    # Check if user missed typing any fields
    if not new_asset.get('name') or not new_asset.get('serial'):
        return jsonify({"error": "Name and Serial are mandatory"}), 400
        
    data.append(new_asset)
    write_data(data)
    return jsonify(new_asset), 201

# 3. UPDATE (PUT method)
@app.route('/api/assets/<serial>', methods=['PUT'])
def update_asset(serial):
    update_info = request.json
    data = read_data()
    
    for asset in data:
        if asset['serial'] == serial:
            asset['name'] = update_info.get('name', asset['name'])
            asset['status'] = update_info.get('status', asset['status'])
            write_data(data)
            return jsonify(asset), 200
            
    return jsonify({"error": "No asset found with that serial number"}), 404

# 4. DELETE (DELETE method)
@app.route('/api/assets/<serial>', methods=['DELETE'])
def delete_asset(serial):
    data = read_data()
    updated_data = [asset for asset in data if asset['serial'] != serial]
    
    if len(data) == len(updated_data):
        return jsonify({"error": "Asset not found"}), 404
        
    write_data(updated_data)
    return jsonify({"message": "Asset deleted successfully"}), 200

@app.route('/')
def home():
    return render_template('index.html')
if __name__ == '__main__':
    # Google Cloud provides a PORT environment variable; default to 8080 locally
    port = int(os.environ.get('PORT', 8080))
    app.run(debug=False, host='0.0.0.0', port=port)