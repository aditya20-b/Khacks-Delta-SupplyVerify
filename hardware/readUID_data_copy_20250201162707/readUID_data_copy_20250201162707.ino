#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 5

MFRC522 rfid(SS_PIN, RST_PIN); // Define MFRC522 object

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

    // Read data from block 4
    String data = readDataFromTag();

    // Send UID and data via Serial (format: "UID|||DATA")
    Serial.println(uid + "|||" + data);

    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }
}

String readDataFromTag() {
  MFRC522::MIFARE_Key key;
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;

  byte block = 4;
  byte buffer[18];
  byte size = sizeof(buffer);
  String data = "";

  // if (rfid.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(rfid.uid)) != MFRC522::STATUS_OK) {
  //   return "Authentication failed";
  // }

  if (rfid.MIFARE_Read(block, buffer, &size) != MFRC522::STATUS_OK) {
    return "Reading failed";
  }

  for (byte i = 0; i < 16; i++) {
    data += (char)buffer[i];
  }

  data.trim(); // Remove trailing spaces
  return data;
}