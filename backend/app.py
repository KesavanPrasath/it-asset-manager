from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = 'data.json'

# Helper function to read the data file
def read_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r') as file:
        return json.load(file)

# Helper function to save changes to the file
def write_data(data):
    with open(DATA_FILE, 'w') as file:
        json.dump(data, file, indent=4)

# 1. GET ALL ASSETS
@app.route('/api/assets', methods=['GET'])
def get_assets():
    return jsonify(read_data()), 200

# 2. ADDING NEW ASSET
@app.route('/api/assets', methods=['POST'])
def add_asset():
    new_asset = request.json
    data = read_data()
    
    # Clean up empty spaces from inputs
    name = new_asset.get('name', '').strip()
    serial = new_asset.get('serial', '').strip()
    status = new_asset.get('status', '').strip()

    # Reject if fields are empty string values
    if not name or not serial:
        return jsonify({"error": "Name and Serial fields cannot be empty"}), 400
        
    # Prevent duplicate serial numbers
    for asset in data:
        if asset['serial'] == serial:
            return jsonify({"error": "An asset with this serial number already exists"}), 400
        
   # Saving clean values
    validated_asset = {
        "name": name,
        "serial": serial,
        "status": status if status else "In Stock"
    }
    data.append(validated_asset)
    write_data(data)
    return jsonify(new_asset), 201

# 3. UPDATE ASSET
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
            
    return jsonify({"error": "Asset not found"}), 404

# 4. DELETE ASSET
@app.route('/api/assets/<serial>', methods=['DELETE'])
def delete_asset(serial):
    data = read_data()
    updated_data = [asset for asset in data if asset['serial'] != serial]
    
    if len(data) == len(updated_data):
        return jsonify({"error": "Asset not found"}), 404
        
    write_data(updated_data)
    return jsonify({"message": "Asset deleted successfully"}), 200

# MAIN SITE ROUTE
@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(debug=True, host='0.0.0.0', port=port)