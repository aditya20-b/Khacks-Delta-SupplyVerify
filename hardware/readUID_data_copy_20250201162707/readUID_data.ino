#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 5

MFRC522 rfid(SS_PIN, RST_PIN); // RFID instance

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("Ready to read UID and data from RFID tags...");
}

void loop() {
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    // Read UID
    String uid = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      if (i > 0) uid += " ";
      uid += String(rfid.uid.uidByte[i], HEX);
    }

    // Detect tag type
    MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
    Serial.print("UID: ");
    Serial.println(uid);
    Serial.print("Tag Type: ");
    Serial.println(rfid.PICC_GetTypeName(piccType));

    String data = "";
    if (piccType == MFRC522::PICC_TYPE_MIFARE_MINI || 
        piccType == MFRC522::PICC_TYPE_MIFARE_1K || 
        piccType == MFRC522::PICC_TYPE_MIFARE_4K) {
      data = readDataFromMifareClassic();
    } 
    else if (piccType == MFRC522::PICC_TYPE_MIFARE_UL) {
      data = readDataFromNTAG213();
    } 
    else {
      data = "Unsupported tag type";
    }

    // Send UID and data via Serial
    Serial.println("Data: " + data);
    
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }
}

String readDataFromMifareClassic() {
  MFRC522::MIFARE_Key key;
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF; // Default key (FFFFFFFFFFFF)

  byte block = 4; // Block to read from
  byte buffer[18];
  byte size = sizeof(buffer);
  String data = "";

  // Authenticate the block
  if (rfid.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(rfid.uid)) != MFRC522::STATUS_OK) {
    return "Authentication failed";
  }

  // Read data from the block
  if (rfid.MIFARE_Read(block, buffer, &size) != MFRC522::STATUS_OK) {
    return "Reading failed";
  }

  for (byte i = 0; i < 16; i++) {
    data += (char)buffer[i];
  }

  data.trim(); // Remove trailing spaces
  return data;
}

String readDataFromNTAG213() {
  String data = "";
  byte buffer[18]; // Buffer size for reading pages
  byte startPage = 4; // User data starts from page 4

  for (byte i = startPage; i < startPage + 4; i++) {  // Read pages 4-7 (16 bytes)
    if (rfid.MIFARE_Read(i, buffer, &buffer[4]) != MFRC522::STATUS_OK) {
      return "Reading failed";
    }
    for (byte j = 0; j < 4; j++) {
      data += (char)buffer[j]; // Convert bytes to characters
    }
  }

  data.trim();
  return data;
}
