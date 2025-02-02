// Initialize contract
await contract.initialize(ctx, JSON.stringify(['owner1', 'owner2', 'owner3']), '2');

// Register a manufacturer
await contract.proposeParticipantRegistration(
    ctx,
    'manufacturer1',
    'Acme Manufacturing',
    'MANUFACTURER'
);

// Create a product
await contract.createProduct(
    ctx,
    'Widget X',
    'Factory A'
);

// Propose product update
await contract.proposeProductUpdate(
    ctx,
    '1',
    'IN_TRANSIT',
    'Warehouse B',
    'Product shipped to warehouse'
);

// Approve transaction
await contract.approveTransaction(ctx, '1');