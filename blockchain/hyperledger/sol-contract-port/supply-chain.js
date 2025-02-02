// supply-chain.js
'use strict';

const { Contract } = require('fabric-contract-api');

// Enums (represented as strings in JavaScript)
const ProductStatus = {
    CREATED: 'CREATED',
    IN_TRANSIT: 'IN_TRANSIT',
    DELIVERED: 'DELIVERED'
};

const ParticipantType = {
    MANUFACTURER: 'MANUFACTURER',
    DISTRIBUTOR: 'DISTRIBUTOR',
    RETAILER: 'RETAILER'
};

const TransactionType = {
    UPDATE_PRODUCT: 'UPDATE_PRODUCT',
    ADD_PARTICIPANT: 'ADD_PARTICIPANT',
    REMOVE_PARTICIPANT: 'REMOVE_PARTICIPANT'
};

class MultiSigSupplyChain extends Contract {
    async initLedger(ctx) {
        // Initialize contract state
        await ctx.stub.putState('owners', Buffer.from(JSON.stringify([])));
        await ctx.stub.putState('required', Buffer.from('0'));
        await ctx.stub.putState('productCount', Buffer.from('0'));
        await ctx.stub.putState('transactionCount', Buffer.from('0'));
    }

    async initialize(ctx, owners, required) {
        owners = JSON.parse(owners);
        required = parseInt(required);

        if (!Array.isArray(owners) || owners.length === 0) {
            throw new Error('Owners required');
        }
        if (required <= 0 || required > owners.length) {
            throw new Error('Invalid required number of owners');
        }

        await ctx.stub.putState('owners', Buffer.from(JSON.stringify(owners)));
        await ctx.stub.putState('required', Buffer.from(required.toString()));
    }

    async _isOwner(ctx) {
        const ownersJson = await ctx.stub.getState('owners');
        const owners = JSON.parse(ownersJson.toString());
        const clientId = ctx.clientIdentity.getID();
        return owners.includes(clientId);
    }

    async _requireOwner(ctx) {
        if (!(await this._isOwner(ctx))) {
            throw new Error('Not an owner');
        }
    }

    async _getParticipant(ctx, participantId) {
        const participantJson = await ctx.stub.getState(`PARTICIPANT_${participantId}`);
        if (!participantJson || participantJson.length === 0) {
            return null;
        }
        return JSON.parse(participantJson.toString());
    }

    async proposeTransaction(ctx, type, data) {
        await this._requireOwner(ctx);

        // Get current transaction count
        const countBytes = await ctx.stub.getState('transactionCount');
        let transactionCount = parseInt(countBytes.toString()) + 1;

        const transaction = {
            id: transactionCount,
            txType: type,
            proposer: ctx.clientIdentity.getID(),
            data: data,
            timestamp: ctx.stub.getTxTimestamp().getSeconds(),
            executed: false,
            approvalCount: 0,
            approvals: {}
        };

        await ctx.stub.putState(
            `TRANSACTION_${transactionCount}`,
            Buffer.from(JSON.stringify(transaction))
        );
        await ctx.stub.putState('transactionCount', Buffer.from(transactionCount.toString()));

        // Emit event
        await ctx.stub.setEvent('TransactionProposed', Buffer.from(JSON.stringify({
            txId: transactionCount,
            proposer: transaction.proposer,
            txType: type
        })));

        return transactionCount;
    }

    async approveTransaction(ctx, txId) {
        await this._requireOwner(ctx);
        
        const transactionJson = await ctx.stub.getState(`TRANSACTION_${txId}`);
        if (!transactionJson || transactionJson.length === 0) {
            throw new Error('Transaction does not exist');
        }

        const transaction = JSON.parse(transactionJson.toString());
        if (transaction.executed) {
            throw new Error('Transaction already executed');
        }

        const clientId = ctx.clientIdentity.getID();
        if (transaction.approvals[clientId]) {
            throw new Error('Transaction already approved');
        }

        // Add approval
        transaction.approvals[clientId] = true;
        transaction.approvalCount++;

        await ctx.stub.putState(
            `TRANSACTION_${txId}`,
            Buffer.from(JSON.stringify(transaction))
        );

        // Emit approval event
        await ctx.stub.setEvent('TransactionApproved', Buffer.from(JSON.stringify({
            txId: txId,
            approver: clientId
        })));

        // Check if enough approvals to execute
        const requiredJson = await ctx.stub.getState('required');
        const required = parseInt(requiredJson.toString());

        if (transaction.approvalCount >= required) {
            await this._executeTransaction(ctx, transaction);
        }
    }

    async _executeTransaction(ctx, transaction) {
        if (transaction.executed) {
            throw new Error('Transaction already executed');
        }

        transaction.executed = true;
        await ctx.stub.putState(
            `TRANSACTION_${transaction.id}`,
            Buffer.from(JSON.stringify(transaction))
        );

        const data = JSON.parse(transaction.data);

        if (transaction.txType === TransactionType.UPDATE_PRODUCT) {
            await this._updateProduct(
                ctx,
                data.productId,
                data.status,
                data.location,
                data.data
            );
        } else if (transaction.txType === TransactionType.ADD_PARTICIPANT) {
            await this._registerParticipant(
                ctx,
                data.participantId,
                data.name,
                data.participantType
            );
        }

        await ctx.stub.setEvent('TransactionExecuted', Buffer.from(JSON.stringify({
            txId: transaction.id
        })));
    }

    async _registerParticipant(ctx, participantId, name, participantType) {
        const existingParticipant = await this._getParticipant(ctx, participantId);
        if (existingParticipant) {
            throw new Error('Participant already registered');
        }

        const participant = {
            id: participantId,
            name: name,
            participantType: participantType,
            isRegistered: true
        };

        await ctx.stub.putState(
            `PARTICIPANT_${participantId}`,
            Buffer.from(JSON.stringify(participant))
        );

        await ctx.stub.setEvent('ParticipantAdded', Buffer.from(JSON.stringify({
            participantId: participantId,
            name: name,
            participantType: participantType
        })));
    }

    async proposeParticipantRegistration(ctx, participantId, name, participantType) {
        await this._requireOwner(ctx);

        const data = JSON.stringify({
            participantId: participantId,
            name: name,
            participantType: participantType
        });

        return this.proposeTransaction(ctx, TransactionType.ADD_PARTICIPANT, data);
    }

    async createProduct(ctx, name, location) {
        const clientId = ctx.clientIdentity.getID();
        const participant = await this._getParticipant(ctx, clientId);
        
        if (!participant || !participant.isRegistered) {
            throw new Error('Not a registered participant');
        }
        if (participant.participantType !== ParticipantType.MANUFACTURER) {
            throw new Error('Only manufacturer can create products');
        }

        const countBytes = await ctx.stub.getState('productCount');
        let productCount = parseInt(countBytes.toString()) + 1;

        const product = {
            id: productCount,
            name: name,
            manufacturer: clientId,
            status: ProductStatus.CREATED,
            timestamp: ctx.stub.getTxTimestamp().getSeconds(),
            location: location,
            trackingHistory: [{
                timestamp: ctx.stub.getTxTimestamp().getSeconds(),
                location: location,
                data: 'Product created',
                participant: clientId
            }]
        };

        await ctx.stub.putState(
            `PRODUCT_${productCount}`,
            Buffer.from(JSON.stringify(product))
        );
        await ctx.stub.putState('productCount', Buffer.from(productCount.toString()));

        await ctx.stub.setEvent('ProductCreated', Buffer.from(JSON.stringify({
            productId: productCount,
            name: name,
            manufacturer: clientId
        })));

        return productCount;
    }

    async proposeProductUpdate(ctx, productId, status, location, data) {
        const clientId = ctx.clientIdentity.getID();
        const participant = await this._getParticipant(ctx, clientId);
        
        if (!participant || !participant.isRegistered) {
            throw new Error('Not a registered participant');
        }

        const txData = JSON.stringify({
            productId: productId,
            status: status,
            location: location,
            data: data
        });

        return this.proposeTransaction(ctx, TransactionType.UPDATE_PRODUCT, txData);
    }

    async _updateProduct(ctx, productId, status, location, data) {
        const productJson = await ctx.stub.getState(`PRODUCT_${productId}`);
        if (!productJson || productJson.length === 0) {
            throw new Error('Product does not exist');
        }

        const product = JSON.parse(productJson.toString());
        const clientId = ctx.clientIdentity.getID();

        product.status = status;
        product.location = location;
        product.timestamp = ctx.stub.getTxTimestamp().getSeconds();
        
        product.trackingHistory.push({
            timestamp: ctx.stub.getTxTimestamp().getSeconds(),
            location: location,
            data: data,
            participant: clientId
        });

        await ctx.stub.putState(
            `PRODUCT_${productId}`,
            Buffer.from(JSON.stringify(product))
        );

        await ctx.stub.setEvent('ProductUpdated', Buffer.from(JSON.stringify({
            productId: productId,
            status: status,
            location: location
        })));
    }

    // Query methods
    async getProduct(ctx, productId) {
        const productJson = await ctx.stub.getState(`PRODUCT_${productId}`);
        if (!productJson || productJson.length === 0) {
            throw new Error('Product does not exist');
        }
        return JSON.parse(productJson.toString());
    }

    async getTransaction(ctx, txId) {
        const txJson = await ctx.stub.getState(`TRANSACTION_${txId}`);
        if (!txJson || txJson.length === 0) {
            throw new Error('Transaction does not exist');
        }
        return JSON.parse(txJson.toString());
    }

    async getParticipant(ctx, participantId) {
        const participant = await this._getParticipant(ctx, participantId);
        if (!participant) {
            throw new Error('Participant does not exist');
        }
        return participant;
    }
}

module.exports = MultiSigSupplyChain;