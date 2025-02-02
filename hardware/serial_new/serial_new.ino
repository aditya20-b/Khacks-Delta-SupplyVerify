#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 5

MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(9600); // Initialize serial communication
  SPI.begin();        // Initialize SPI bus
  rfid.PCD_Init();    // Initialize MFRC522

  Serial.println("Ready to read RFID/NFC tags...");
}

void loop() {
  // Check if a new tag is present
  if (rfid.PICC_IsNewCardPresent()) {
    // Read the tag's UID
    if (rfid.PICC_ReadCardSerial()) {
      // Display the UID of the tag
      Serial.print("UID:");
      for (int i = 0; i < rfid.uid.size; i++) {
        Serial.print(rfid.uid.uidByte[i] < 0x10 ? " 0" : " ");
        Serial.print(rfid.uid.uidByte[i], HEX);
      }
      Serial.println();

      // Read data from the tag
      readDataFromTag();

      // Halt the tag and stop encryption
      rfid.PICC_HaltA();
      rfid.PCD_StopCrypto1();
    }
  }
}

// Function to read data from the RFID tag
void readDataFromTag() {
  MFRC522::MIFARE_Key key;
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF; // Default key (FFFFFFFFFFFF)

  byte block = 4; // Block to read from (you can change this)
  byte buffer[18];
  byte size = sizeof(buffer);

  // Authenticate the block
  if (rfid.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(rfid.uid)) != MFRC522::STATUS_OK) {
    Serial.println("Authentication failed");
    return;
  }

  // Read data from the block
  if (rfid.MIFARE_Read(block, buffer, &size) != MFRC522::STATUS_OK) {
    Serial.println("Reading failed");
    return;
  }

  // Display the data
  Serial.print("Data in block ");
  Serial.print(block);
  Serial.print(": ");
  for (byte i = 0; i < 16; i++) {
    Serial.print((char)buffer[i]); // Print data as characters
  }
  Serial.println();
}