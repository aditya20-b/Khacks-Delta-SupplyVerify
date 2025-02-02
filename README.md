# TemeKnows - Know your Product

Supply Verify is a comprehensive supply chain verification platform that leverages blockchain technology, IoT devices, and smart contracts to provide end-to-end tracking of a product's lifecycle—from manufacturing to the end consumer. This project was developed during a hackathon to address issues of product authenticity and integrity in modern supply chains.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

Supply Verify enables manufacturers to tag products with QR codes or NFC stickers. Once registered, each product is tracked in real time using IoT sensors that monitor key parameters (temperature, humidity, vibrations, gyroscopic data, etc.). Data from these sensors is then recorded on both traditional databases and blockchains (Hyperledger Fabric for B2B and Solana CEK for B2C), ensuring a tamper-proof record of the product's journey.

---

## Features

- **Product Registration & Metadata Storage:**  
  - Manufacturers can register products via a dedicated portal.
  - Product metadata is stored in a traditional database.
  - Immutable data (e.g., certifications) is stored on IPFS.
  
- **IoT-based Monitoring:**  
  - Real-time sensor data collection (temperature, humidity, vibrations, etc.).
  - Aggregation of IoT data for quick insights and event-triggered blockchain updates.

- **Blockchain Integration:**  
  - **Hyperledger Fabric:** Manages B2B transactions, chain of custody, and secure asset transfers.
  - **Solana CEK:** Provides consumer-facing transaction records and product lifecycle transparency.
  - **Smart Contracts:** Automated validation of supply chain events.

- **Hardware Integration:**  
  - Code for interfacing with sensors (e.g., MBU6050) and RFID/NFC reading devices.
  
- **User Interfaces:**  
  - **Manufacturer App & Website:** For product registration, real-time monitoring, and dashboard analytics.
  - **Consumer Portal:** Enables end users to verify product authenticity by scanning QR/NFC tags.
  
- **Analytics & Predictive Modeling:**  
  - Real-time shipment tracking and dashboard analytics.
  - Incident reporting and predictive analysis for potential supply chain issues.

---

## Architecture

Supply Verify comprises multiple interrelated components:

- **Backend Services:**  
  Handle API requests, product registration, data aggregation from IoT devices, and communication with blockchain networks.

- **Blockchain Modules:**  
  Include smart contract implementations and network configurations for both Hyperledger Fabric and Solidity-based contracts.  
  - **Forge Contracts:** Smart contracts developed and tested using Forge.
  - **Hyperledger Fabric:** Chaincode implementations in TypeScript and supporting network configurations.
  - **Solidity Contracts:** Additional smart contracts for blockchain interactions.

- **Hardware Layer:**  
  Interacts with sensors and RFID/NFC modules to capture and relay real-world data.

- **Frontend Applications:**  
  Consist of a manufacturer-facing application (mobile/web) for product onboarding and monitoring, as well as a consumer-facing website for product verification.

---

## Directory Structure

Below is an overview of the project structure:

```plaintext
-
├── backend                                - Backend services for APIs and data processing.
├── blockchain                             - Blockchain-related modules and smart contract development.
│   ├── forge-contracts                    - Forge-based smart contracts and scripts.
│   │   ├── script                         - Deployment and interaction scripts for Forge-based smart contracts.
│   │   ├── src                            - Source code for smart contracts.
│   │   └── test                           - Test suites for smart contracts.
│   ├── hyperledger                        - Hyperledger Fabric configurations, chaincode, and network setup.
│   │   ├── asset-transfer-basic           - Basic asset transfer chaincode and applications.
│   │   │   ├── application-gateway-typescript - Gateway applications to interact with the chaincode.
│   │   │   ├── chaincode-external         - External chaincode integrations.
│   │   │   ├── chaincode-typescript       - Chaincode implementation in TypeScript.
│   │   │   └── rest-api-typescript        - REST API for chaincode interactions.
│   │   ├── builders
│   │   │   └── ccaas                      - Builders for Chaincode as a Service (CCaaS).
│   │   ├── sol-contract-port
│   │   │   └── typescript                 - TypeScript implementation for Solidity contract porting.
│   │   └── test-network                   - Test network configuration for Hyperledger Fabric.
│   │       ├── addOrg3                    - Scripts/configurations for adding an organization.
│   │       ├── bft-config                 - Byzantine Fault Tolerant (BFT) configuration.
│   │       ├── channel-artifacts          - Artifacts for channel creation.
│   │       ├── compose                    - Docker Compose files for network deployment.
│   │       ├── configtx                   - Network configuration transactions.
│   │       ├── organizations              - Organization-specific configurations.
│   │       ├── packagedChaincode          - Pre-packaged chaincode ready for deployment.
│   │       ├── prometheus-grafana         - Monitoring with Prometheus and Grafana.
│   │       ├── scripts                    - Utility scripts for network management.
│   │       └── system-genesis-block       - Genesis block for the system channel.
│   └── solidity-contracts                 - Additional Solidity smart contracts.
├── contract-poc                           - Proof-of-concept for smart contract applications.
│   └── src
│       ├── abi                            - ABI definitions for smart contract interactions.
│       ├── app                            - Proof-of-concept application demonstrating contract usage.
│       ├── components                     - Reusable UI components.
│       └── utils                          - Utility functions and helpers.
├── customer-app                           - Application for customer-facing features.
│   ├── app
│   │   ├── components                     - Frontend components for customer interactions.
│   │   ├── types                          - Type definitions and interfaces.
│   │   └── utils                          - Utility functions and helpers.
│   ├── components
│   │   └── ui                             - UI elements and reusable design components.
│   └── public                             - Public static assets like images and icons.
├── hardware                               - Hardware interfacing code for IoT and sensor data.
│   ├── mbu6050                            - Code interfacing with the MBU6050 sensor.
│   ├── readUID_data_copy_20250201162707   - Scripts/data for reading UIDs from RFID/NFC scanners.
│   ├── serial_                            - Serial communication implementations.
│   ├── serial_new                         - Updated serial communication modules.
│   └── writing                            - Code for writing data to hardware components.
├── manufacturer-app                       - Manufacturer-specific application for supply chain management.
│   ├── public
│   │   └── assets                         - Static assets (images, fonts, etc.) for the app.
│   └── src
│       ├── components                     - Frontend components for the manufacturer app.
│       ├── types                          - Type definitions and interfaces.
│       └── utils                          - Utility functions and shared services.
└── manufacturer-website                   - Website for manufacturers with dashboards and admin panels.
    ├── app
    │   ├── admin                          - Administrative panel components.
    │   ├── components                     - Core website components.
    │   ├── dashboard                      - Dashboard for tracking products and shipments.
    │   │   ├── open-food-facts            - Open Food Facts integration module.
    │   │   ├── problematic-shipments      - Module for tracking problematic shipments.
    │   │   └── product-tracking           - Product tracking and supply chain analytics.
    │   ├── onboarding                     - Onboarding flow for new users or manufacturers.
    │   ├── pending-approval               - Pending approval processes for new accounts or products.
    │   └── types                          - Type definitions and data models.
    ├── data                               - Sample data, configuration files, or data models.
    ├── docs                               - Documentation related to the project.
    └── public                             - Publicly accessible files for the website (static assets).
```

---

## Installation & Setup

### Prerequisites

- **Node.js** (v14.x or higher)
- **npm** or **yarn**
- **Docker** (for Hyperledger Fabric test network)
- **Forge** (for deploying Solidity contracts; see [Foundry](https://github.com/gakonst/foundry))
- **Hyperledger Fabric** prerequisites (refer to the [Hyperledger Fabric documentation](https://hyperledger-fabric.readthedocs.io/))

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/aditya20-b/supply-verify.git
   cd supply-verify
   ```

2. **Backend Setup:**

   - Navigate to the `backend` directory:
   
     ```bash
     cd backend
     npm install
     npm start
     ```
   

3. **Blockchain Setup:**

   - **Forge Contracts:**
     - Navigate to `blockchain/forge-contracts`.
     - Follow the instructions in the README within this directory to deploy and test the contracts.
   
   - **Hyperledger Fabric:**
     - Navigate to `blockchain/hyperledger/test-network`.
     - Use Docker Compose to spin up the network:
   
       ```bash
       docker-compose -f docker-compose.yaml up -d
       ```
   
     - Deploy chaincode from `asset-transfer-basic` by following the instructions provided in the subdirectories (e.g., `chaincode-typescript` or `rest-api-typescript`).
   
   - **Solana CEK Contracts:**
     - Navigate to `blockchain/sol-contract-port/typescript` and deploy the contracts as per the README in that folder.

4. **Contract Proof-of-Concept (POC):**

   - Navigate to `contract-poc/src`:
   
     ```bash
     cd contract-poc/src
     npm install
     npm run start
     ```

5. **Hardware Integration:**

   - Connect your IoT sensors and RFID/NFC modules.
   - Compile and execute the hardware interfacing scripts found in the `hardware` directory.
   - Review individual module READMEs or comments for specific sensor configurations.

6. **Manufacturer App & Website:**

   - **Manufacturer App:**
     - Navigate to `manufacturer-app`:
   
       ```bash
       cd manufacturer-app
       npm install
       npm run start
       ```
   
   - **Manufacturer Website:**
     - Navigate to `manufacturer-website`:
   
       ```bash
       cd manufacturer-website
       npm install
       npm run start
       ```

---

## Usage

- **For Manufacturers:**  
  Use the Manufacturer Portal to register products, attach identifiers (QR/NFC), and monitor shipments in real time through the dashboard.

- **For Supply Chain Operators:**  
  Utilize the administrative dashboard to access sensor data analytics, monitor blockchain logs, and track shipments for quality and authenticity assurance.

- **For Consumers:**  
  Scan the product QR/NFC codes using the mobile app or website to view the entire lifecycle of the product, including all checkpoints and sensor data.

---

## Testing

Each component includes its own test suite:

- **Smart Contracts:**  
  Run tests in the `forge-contracts/test` or within Hyperledger modules using:
  ```bash
  npm test
  ```
- **Backend & POC:**  
  Execute tests using:
  ```bash
  npm test
  ```
- **Frontend Applications:**  
  Use your framework's testing commands (e.g., `npm run test` for React/Vue apps).

---

*Happy Tracking & Verifying!*
