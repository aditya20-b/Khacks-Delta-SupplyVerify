import serial
from pymongo import MongoClient
from datetime import datetime
import json

# Configure Serial Port (replace '/dev/cu.usbmodem11101' with your Arduino's port)
ser = serial.Serial('/dev/cu.usbmodem11201', 9600, timeout=1)

# MongoDB Atlas Connection
MONGO_URI = ""
client = MongoClient(MONGO_URI)
db = client['sensor_database']  # Replace with your database name
rfid_collection = db['rfid_logs']  # Collection for RFID data
dht_collection = db['dht_logs']  # Collection for DHT22 data

def send_to_mongodb(collection, data):
    try:
        collection.insert_one(data)
        print(f"Data saved: {data}")
    except Exception as e:
        print(f"Error saving data: {e}")

while True:
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8').strip()
        if line:
            try:
                data = json.loads(line)
                data["timestamp"] = datetime.now()  # Add timestamp

                # Check the sensor type and save to the appropriate collection
                if data["sensor"] == "RFID":
                    send_to_mongodb(rfid_collection, data)
                elif data["sensor"] == "DHT22":
                    send_to_mongodb(dht_collection, data)
                else:
                    print("Unknown sensor type")
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON: {e}")