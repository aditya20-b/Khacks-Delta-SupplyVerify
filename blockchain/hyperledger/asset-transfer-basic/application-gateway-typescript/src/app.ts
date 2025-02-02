// src/api/supplyChainRoutes.ts
import express from 'express';
import * as grpc from '@grpc/grpc-js';
import { promises as fs } from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';   
import { TextDecoder } from 'util';
import { connect, Contract, Identity, Signer, signers, hash } from '@hyperledger/fabric-gateway';

const router = express.Router();
const utf8Decoder = new TextDecoder();

// 1. Standardized Asset Data Structure
interface Asset {
    assetId: string;
    color: string;
    size: number;
    owner: string;
    appraisedValue: number;
    description: string;   // Optional field for additional details
    location: string;          // Optional field to categorize the asset
    temperature: number;       // Optional field to track temperature
    humidity: number;          // Optional field to track humidity
    additionalInformation: string;  // Optional field for any other data
}

// Configuration parameters
const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';
const mspId = process.env.MSP_ID || 'Org1MSP';
const cryptoPath = process.env.CRYPTO_PATH || path.resolve(__dirname, '/Users/aditya/Documents/Github/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com');
const keyDirectoryPath = process.env.KEY_DIRECTORY_PATH || path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore');
const certDirectoryPath = process.env.CERT_DIRECTORY_PATH || path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts');
const tlsCertPath = process.env.TLS_CERT_PATH || path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt');
const peerEndpoint = process.env.PEER_ENDPOINT || 'localhost:7051';
const peerHostAlias = process.env.PEER_HOST_ALIAS || 'peer0.org1.example.com';

// Helper functions to create the gRPC connection and Fabric Gateway objects
async function newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

async function newIdentity(): Promise<Identity> {
    const files = await fs.readdir(certDirectoryPath);
    if (!files || files.length === 0) {
      throw new Error(`No certificate files found in ${certDirectoryPath}`);
    }
    const certPath = path.join(certDirectoryPath, files[0]!);
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function newSigner(): Promise<Signer> {
    const files = await fs.readdir(keyDirectoryPath);
    if (!files || files.length === 0) {
      throw new Error(`No key files found in ${keyDirectoryPath}`);
    }
    const keyPath = path.join(keyDirectoryPath, files[0]!);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

async function getGateway() {
    const client = await newGrpcConnection();
    const gateway = connect({
      client,
      identity: await newIdentity(),
      signer: await newSigner(),
      hash: hash.sha256,
      // Set default deadlines for different types of gRPC calls.
      evaluateOptions: () => ({ deadline: Date.now() + 5000 }),
      endorseOptions: () => ({ deadline: Date.now() + 15000 }),
      submitOptions: () => ({ deadline: Date.now() + 5000 }),
      commitStatusOptions: () => ({ deadline: Date.now() + 60000 }),
    });
    return { gateway, client };
}

// -----------------------------------------------------------------------------
// API Endpoints
// -----------------------------------------------------------------------------

// Get all assets
router.get('/assets', async (req, res) => {
  try {
      const { gateway, client } = await getGateway();
      const network = gateway.getNetwork(channelName);
      const contract: Contract = network.getContract(chaincodeName);
      const resultBytes = await contract.evaluateTransaction('GetAllAssets');
      const resultJson = utf8Decoder.decode(resultBytes);
      const result: Asset[] = JSON.parse(resultJson);
      res.json({ success: true, assets: result });
      gateway.close();
      client.close();
  } catch (err: any) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
  }
});

// Create a new asset
router.post('/asset', async (req, res) => {
   try {
       // Validate that required fields are provided.
       const { assetId, color, size, owner, appraisedValue, description, type } = req.body;
       if (!assetId || !color || !size || !owner || !appraisedValue) {
           res.status(400).json({ success: false, error: 'Missing required asset details' });
           return;
       }
       const { gateway, client } = await getGateway();
       const network = gateway.getNetwork(channelName);
       const contract: Contract = network.getContract(chaincodeName);
       // Submit the transaction with all fields. (Chaincode should handle empty strings.)
       await contract.submitTransaction(
           'CreateAsset',
           assetId,
           color,
           size.toString(),
           owner,
           appraisedValue.toString(),
           description || '',
           type || ''
       );
       res.json({ success: true, message: 'Asset created successfully' });
       gateway.close();
       client.close();
   } catch (err: any) {
       console.error(err);
       res.status(500).json({ success: false, error: err.message });
   }
});

// Read an asset by ID
router.get('/asset/:id', async (req, res) => {
   try {
       const assetId = req.params.id;
       const { gateway, client } = await getGateway();
       const network = gateway.getNetwork(channelName);
       const contract: Contract = network.getContract(chaincodeName);
       const resultBytes = await contract.evaluateTransaction('ReadAsset', assetId);
       const resultJson = utf8Decoder.decode(resultBytes);
       const result: Asset = JSON.parse(resultJson);
       res.json({ success: true, asset: result });
       gateway.close();
       client.close();
   } catch (err: any) {
       console.error(err);
       res.status(500).json({ success: false, error: err.message });
   }
});

// Transfer asset ownership
router.post('/asset/transfer', async (req, res) => {
   try {
       const { assetId, newOwner } = req.body;
       if (!assetId || !newOwner) {
           res.status(400).json({ success: false, error: 'Missing required assetId or newOwner' });
           return;
       }
       const { gateway, client } = await getGateway();
       const network = gateway.getNetwork(channelName);
       const contract: Contract = network.getContract(chaincodeName);
       // Use asynchronous submission to wait for the commit status.
       const commit = await contract.submitAsync('TransferAsset', { arguments: [assetId, newOwner] });
       const status = await commit.getStatus();
       if (!status.successful) {
           res.status(500).json({ success: false, error: `Transaction ${status.transactionId} failed with code ${status.code}` });
           return;
       }
       res.json({ success: true, message: `Asset ${assetId} transferred to ${newOwner}`, transactionId: status.transactionId });
       gateway.close();
       client.close();
   } catch (err: any) {
       console.error(err);
       res.status(500).json({ success: false, error: err.message });
   }
});

// -----------------------------------------------------------------------------
// Endpoints for Private Asset Information
// -----------------------------------------------------------------------------

// Add or update private information for an asset
router.post('/asset/:id/private', async (req, res) => {
   try {
       const assetId = req.params.id;
       const { privateData } = req.body;
       if (!privateData) {
           res.status(400).json({ success: false, error: 'Missing privateData in request body' });
           return;
       }
       const { gateway, client } = await getGateway();
       const network = gateway.getNetwork(channelName);
       const contract: Contract = network.getContract(chaincodeName);
       // Assume the chaincode function 'AddPrivateInfo' stores private data in a private data collection.
       await contract.submitTransaction('AddPrivateInfo', assetId, JSON.stringify(privateData));
       res.json({ success: true, message: `Private information added for asset ${assetId}` });
       gateway.close();
       client.close();
   } catch (err: any) {
       console.error(err);
       res.status(500).json({ success: false, error: err.message });
   }
});

// Fetch private information for an asset
router.get('/asset/:id/private', async (req, res) => {
   try {
       const assetId = req.params.id;
       const { gateway, client } = await getGateway();
       const network = gateway.getNetwork(channelName);
       const contract: Contract = network.getContract(chaincodeName);
       // Assume the chaincode function 'GetPrivateInfo' retrieves private data.
       const resultBytes = await contract.evaluateTransaction('GetPrivateInfo', assetId);
       const resultJson = utf8Decoder.decode(resultBytes);
       const privateData = JSON.parse(resultJson);
       res.json({ success: true, assetId, privateData });
       gateway.close();
       client.close();
   } catch (err: any) {
       console.error(err);
       res.status(500).json({ success: false, error: err.message });
   }
});

// Delete private information for an asset
router.delete('/asset/:id/private', async (req, res) => {
   try {
       const assetId = req.params.id;
       const { gateway, client } = await getGateway();
       const network = gateway.getNetwork(channelName);
       const contract: Contract = network.getContract(chaincodeName);
       // Assume the chaincode function 'DeletePrivateInfo' deletes the private data.
       await contract.submitTransaction('DeletePrivateInfo', assetId);
       res.json({ success: true, message: `Private information deleted for asset ${assetId}` });
       gateway.close();
       client.close();
   } catch (err: any) {
       console.error(err);
       res.status(500).json({ success: false, error: err.message });
   }

});

export default router;

