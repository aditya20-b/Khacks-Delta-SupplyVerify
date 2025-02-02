// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract MultisigSupplyChain is AccessControl {
    // Roles

    // A "Package" requires to anything that is part of the supply chain
    // Each package is it's own EOA, so that it can sign messages and transactions
    // and update it's own state. This is done to allow the hardware on the shipment
    // have full control over the chain state (no room for tampering)
    bytes32 public constant PACKAGE_ROLE = keccak256("PACKAGE_ROLE");

    // When a package reaches a certain PoI, a privileged person known as a
    // "Verifier" will have to update the state of the package at the PoI and
    // verify that there is no tampering of the package
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    // Admin is responsible for assigning the VERIFIER_ROLE to trusted parties
    // at designated PoI. A record of each verifier should be maintained off-chain
    // along with their Ethereum address
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");

    // Enums
    enum ProductState {
        UNINITIALIZED,
        CREATED,
        IN_TRANSIT,
        RECEIVED,
        UNDER_REVIEW
    }

    // Structs
    struct ShipmentState {
        address receiver; // The person receiving the package;
        uint256 id;
        ProductState state;
        uint256 createdAt; // Created timestamp
        uint256 updatedAt; // Updated timestamp
        uint256 nonce; // Used to reference current state
        bytes proposedEvent; // Used by verifier EOA to propose an event
        bool proposedEventExists; // Boolean to check if an event has been proposed but not accepted
        bool receiverAccepted; // Whether a receiver has confirmed they have taken possession of the package
        mapping(uint256 => bytes) nonceToEvent; // Used for eventual tracking of the verifier
        mapping(uint256 => address) nonceToVerifier; // Used to check which verifier approved the event
    }

    uint256 private _currentShipmentId;
    // Mapping of addresses (e.g., EOAs) to ShipmentStates
    mapping(address => ShipmentState) public shipments;

    event shipmentCreated(uint id, address packageAddress);
    event shipmentStarted(uint id, address packageAddress, address verifier);
    event shipmentEventProposed(
        uint id,
        address packageAddress,
        bytes proposedEvent
    );
    event shipmentEventApproved(
        uint id,
        uint eventNonce,
        address packageAddress,
        address verifier
    );
    event shipmentUnderReview(uint id, address packageAddress, address admin);
    event shipmentAccepted(uint id, address packageAddress, address receiver);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createShipment(address packageAddress, address receiver) public {
        require(
            shipments[packageAddress].state == ProductState.UNINITIALIZED,
            "SUPPLY_CHAIN: Shipment has already been initialized"
        );

        ShipmentState storage shipment = shipments[packageAddress];

        _currentShipmentId++;
        shipment.id = _currentShipmentId;
        shipment.state = ProductState.CREATED;
        shipment.createdAt = block.timestamp;
        shipment.updatedAt = block.timestamp;
        shipment.receiver = receiver;

        _grantRole(PACKAGE_ROLE, packageAddress);

        emit shipmentCreated(_currentShipmentId, packageAddress);
    }

    function startShipment(
        address packageAddress
    ) public onlyRole(VERIFIER_ROLE) {
        require(
            shipments[packageAddress].state == ProductState.CREATED,
            "SUPPLY_CHAIN: Shipment does not exist or has been started"
        );

        ShipmentState storage shipment = shipments[packageAddress];

        shipment.state = ProductState.IN_TRANSIT;
        shipment.updatedAt = block.timestamp;

        // Basically, the first person to interact with the shipment is the person who "init"s it
        shipment.nonceToVerifier[0] = msg.sender;

        emit shipmentStarted(shipment.id, packageAddress, msg.sender);
    }

    function proposeShipmentEvent(
        bytes memory shipmentEvent
    ) public onlyRole(PACKAGE_ROLE) {
        require(
            shipments[msg.sender].state == ProductState.IN_TRANSIT,
            "SUPPLY_CHAIN: Invalid shipment state"
        );

        require(
            !shipments[msg.sender].proposedEventExists,
            "SUPPLY_CHAIN: An event has already been proposed"
        );

        ShipmentState storage shipment = shipments[msg.sender];

        shipment.nonce++; // <-- fix this
        shipment.updatedAt = block.timestamp;
        shipment.proposedEvent = shipmentEvent;
        shipment.proposedEventExists = true;
        shipment.nonceToEvent[shipment.nonce] = shipmentEvent;

        emit shipmentEventProposed(shipment.id, msg.sender, shipmentEvent);
    }

    function approveShipmentEvent(
        address packageAddress
    ) public onlyRole(VERIFIER_ROLE) {
        require(
            shipments[packageAddress].state == ProductState.IN_TRANSIT,
            "SUPPLY_CHAIN: Invalid shipment state"
        );

        require(
            shipments[packageAddress].proposedEventExists,
            "SUPPLY_CHAIN: Proposed event not found!"
        );

        ShipmentState storage shipment = shipments[packageAddress];

        shipment.updatedAt = block.timestamp;
        shipment.proposedEventExists = false;
        shipment.nonceToVerifier[shipment.nonce] = msg.sender;

        emit shipmentEventApproved(
            shipment.id,
            shipment.nonce,
            packageAddress,
            msg.sender
        );
    }

    // Function used in case tampering is found
    // Issue must be escalated by verifier to admin for futher inspection
    function denyShipment(address packageAddress) public onlyRole(OWNER_ROLE) {
        ShipmentState storage shipment = shipments[packageAddress];

        shipment.updatedAt = block.timestamp;
        shipment.state = ProductState.UNDER_REVIEW;

        emit shipmentUnderReview(shipment.id, packageAddress, msg.sender);
    }

    // Function for receiver to accept a shipment
    function acceptShipment(address packageAddress) public {
        require(
            shipments[packageAddress].receiver == msg.sender,
            "SUPPLY_CHAIN: You are not the receiver"
        );

        ShipmentState storage shipment = shipments[packageAddress];

        shipment.updatedAt = block.timestamp;
        shipment.receiverAccepted = true;
        shipment.state = ProductState.RECEIVED;

        emit shipmentAccepted(shipment.id, packageAddress, msg.sender);
    }

    // Roles
    function grantAdminRole(address a) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(OWNER_ROLE, a);
    }

    function grantVerifierRole(address a) public onlyRole(OWNER_ROLE) {
        _grantRole(VERIFIER_ROLE, a);
    }

    // Pure functions
    function encodeShipmentEvent(
        string memory location,
        uint temperature,
        uint humidity
    ) public pure returns (bytes memory) {
        bytes memory shipmentEvent = abi.encode(
            location,
            temperature,
            humidity
        );
        return shipmentEvent;
    }

    function decodeShipmentEvent(
        bytes memory data
    )
        public
        pure
        returns (string memory location, uint temperature, uint humidity)
    {
        (string memory _location, uint _temperature, uint _humidity) = abi
            .decode(data, (string, uint, uint));

        return (_location, _temperature, _humidity);
    }
}
