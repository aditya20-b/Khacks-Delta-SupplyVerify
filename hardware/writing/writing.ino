#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 5

// Debug message buffer
#define MAX_DEBUG_MESSAGES 10
String debugMessages[MAX_DEBUG_MESSAGES];
int debugMessageIndex = 0;

MFRC522 rfid(SS_PIN, RST_PIN);

// Status tracking
bool nfcInitialized = false;
unsigned long lastOperationTime = 0;
String lastError = "";

void addDebugMessage(String message) {
  // Add timestamp to message
  String timeStamp = String(millis());
  String formattedMessage = timeStamp + "ms: " + message;
  
  // Store in circular buffer
  debugMessages[debugMessageIndex] = formattedMessage;
  debugMessageIndex = (debugMessageIndex + 1) % MAX_DEBUG_MESSAGES;
  
  // Print to serial
  Serial.println(formattedMessage);
}

void printDebugInfo() {
  Serial.println("\n--- Debug Information ---");
  for (int i = 0; i < MAX_DEBUG_MESSAGES; i++) {
    int index = (debugMessageIndex + i) % MAX_DEBUG_MESSAGES;
    if (debugMessages[index] != "") {
      Serial.println(debugMessages[index]);
    }
  }
  Serial.println("---------------------\n");
}

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // Wait for serial port to connect
  }
  
  addDebugMessage("Initializing NFC reader...");
  
  SPI.begin();
  rfid.PCD_Init();
  
  // Check if initialization was successful
  byte version = rfid.PCD_ReadRegister(MFRC522::VersionReg);
  if (version == 0x00 || version == 0xFF) {
    nfcInitialized = false;
    lastError = "Failed to initialize NFC module";
    addDebugMessage(lastError);
  } else {
    nfcInitialized = true;
    addDebugMessage("NFC Module initialized successfully");
    addDebugMessage("Version: 0x" + String(version, HEX));
  }
  
  printDebugInfo();
}

void loop() {
  if (!nfcInitialized) {
    if (millis() - lastOperationTime > 5000) {  // Check every 5 seconds
      addDebugMessage("NFC module not initialized. Check connections.");
      lastOperationTime = millis();
    }
    return;
  }

  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    addDebugMessage("Tag detected! UID: " + getUIDString(rfid.uid.uidByte, rfid.uid.size));
    
    // Data to write (16 characters exactly)
    const char* dataToWrite = "Vishal Shreeya";
    
    // Write data to the tag
    writeDataToTag(dataToWrite);
    
    // Halt the tag
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
    
    printDebugInfo();
    delay(1000);  // Prevent immediate re-reading
  }
}

String getUIDString(byte *buffer, byte bufferSize) {
  String result = "";
  for (byte i = 0; i < bufferSize; i++) {
    result += (buffer[i] < 0x10 ? "0" : "");
    result += String(buffer[i], HEX);
    if (i < bufferSize - 1) result += ":";
  }
  return result;
}

void writeDataToTag(const char* data) {
  addDebugMessage("Attempting to write: " + String(data));
  
  MFRC522::MIFARE_Key key;
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;
  
  byte block = 4;
  byte buffer[16];
  byte dataLength = strlen(data);

  memset(buffer, ' ', 16);
  memcpy(buffer, data, min(dataLength, 16));

  // // Authentication
  // if (rfid.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(rfid.uid)) != MFRC522::STATUS_OK) {
  //   lastError = "Authentication failed";
  //   addDebugMessage(lastError);
  //   return;
  // }
  // addDebugMessage("Authentication successful");

  // Write data
  MFRC522::StatusCode status = rfid.MIFARE_Write(block, buffer, 16);
  if (status != MFRC522::STATUS_OK) {
    lastError = "Writing failed with status: " + String(status);
    addDebugMessage(lastError);
  } else {
    addDebugMessage("Data written successfully!");
    
    // Verify written data
    byte readBuffer[18];
    byte bufferSize = sizeof(readBuffer);  // Fixed: Declare bufferSize
    status = rfid.MIFARE_Read(block, readBuffer, &bufferSize);
    if (status == MFRC522::STATUS_OK) {
      addDebugMessage("Verification read successful");
      // Compare written and read data
      bool dataMatch = true;
      for (byte i = 0; i < 16; i++) {
        if (readBuffer[i] != buffer[i]) {
          dataMatch = false;
          break;
        }
      }
      addDebugMessage(dataMatch ? "Data verified correctly" : "Data verification failed");
    } else {
      addDebugMessage("Verification read failed");
    }
  }
}