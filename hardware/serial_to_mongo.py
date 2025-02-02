import serial
from pymongo import MongoClient
from datetime import datetime
from enum import Enum, auto

# Define ProductState enum
class ProductState(Enum):
    UNINITIALIZED = auto()
    CREATED = auto()
    IN_TRANSIT = auto()
    RECEIVED = auto()
    UNDER_REVIEW = auto()

# MongoDB connection
MONGO_URI = ""
client = MongoClient(MONGO_URI)
db = client['container_monitor']
crash_logs = db['crash_logs']
state_logs = db['state_logs']

# Serial connection (adjust port and baud rate)
ser = serial.Serial('/dev/cu.usbserial-1110', 9600, timeout=1)

# Thresholds for anomaly detection (increased for simulation)
ACCEL_THRESHOLD = 15  # Increased threshold for acceleration
GYRO_THRESHOLD = 600  # Increased threshold for gyroscope

# Initial state
current_state = ProductState.UNINITIALIZED

def check_anomaly(data):
    accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z = map(float, data)
    if (
        abs(accel_x) > ACCEL_THRESHOLD or
        abs(accel_y) > ACCEL_THRESHOLD or
        abs(accel_z) > ACCEL_THRESHOLD or
        abs(gyro_x) > GYRO_THRESHOLD or
        abs(gyro_y) > GYRO_THRESHOLD or
        abs(gyro_z) > GYRO_THRESHOLD
    ):
        return True
    return False

def update_state(new_state):
    global current_state
    if current_state != new_state:
        current_state = new_state
        state_logs.insert_one({
            "state": current_state.name,
            "timestamp": datetime.now()
        })
        print(f"State updated to: {current_state.name}")

while True:
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8').strip()
        data = line.split(',')
        if len(data) == 6:  # Ensure all 6 values are received
            # Check for anomalies
            if check_anomaly(data):
                # Log crash message in MongoDB
                log = {
                    "message": "The container crashed!",
                    "timestamp": datetime.now()
                }
                crash_logs.insert_one(log)
                print("Crash detected and logged!")
                update_state(ProductState.UNDER_REVIEW)
            else:
                # Simulate state transitions based on sensor data
                accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z = map(float, data)
                if current_state == ProductState.UNINITIALIZED:
                    update_state(ProductState.CREATED)
                elif current_state == ProductState.CREATED and abs(accel_x) > 5:
                    update_state(ProductState.IN_TRANSIT)
                elif current_state == ProductState.IN_TRANSIT and abs(accel_x) < 2:
                    update_state(ProductState.RECEIVED)