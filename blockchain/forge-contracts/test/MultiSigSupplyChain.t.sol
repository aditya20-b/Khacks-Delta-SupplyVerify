// SPDX-License-Identifier: MIT
pragma solidity =0.8.20;

import "forge-std/Test.sol";
import "../src/MultisigSupplyChain.sol";

contract MultisigSupplyChainTest is Test {
    MultisigSupplyChain public supplyChain;
    address public admin;
    address public verifier;
    address public package;
    address public receiver;

    // Events for testing
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

    function setUp() public {
        // Setup addresses
        admin = makeAddr("admin");
        verifier = makeAddr("verifier");
        package = makeAddr("package");
        receiver = makeAddr("receiver");

        // Deploy contract as admin
        vm.prank(admin);
        supplyChain = new MultisigSupplyChain();

        // Grant roles
        vm.startPrank(admin);
        supplyChain.grantAdminRole(admin);
        supplyChain.grantVerifierRole(verifier);
        vm.stopPrank();
    }

    function test_CreateShipment() public {
        vm.prank(admin);
        vm.expectEmit(true, true, false, true);
        emit shipmentCreated(1, package);
        supplyChain.createShipment(package, receiver);

        // Verify package has PACKAGE_ROLE
        assertTrue(supplyChain.hasRole(supplyChain.PACKAGE_ROLE(), package));
    }

    function test_StartShipment() public {
        // Create shipment first
        vm.prank(admin);
        supplyChain.createShipment(package, receiver);

        // Start shipment as verifier
        vm.prank(verifier);
        vm.expectEmit(true, true, true, true);
        emit shipmentStarted(1, package, verifier);
        supplyChain.startShipment(package);
    }

    function test_ProposeAndApproveShipmentEvent() public {
        // Setup shipment
        vm.prank(admin);
        supplyChain.createShipment(package, receiver);
        vm.prank(verifier);
        supplyChain.startShipment(package);

        // Create shipment event data
        bytes memory eventData = supplyChain.encodeShipmentEvent(
            "New York",
            20,
            65
        );

        // Propose event as package
        vm.prank(package);
        vm.expectEmit(true, true, false, true);
        emit shipmentEventProposed(1, package, eventData);
        supplyChain.proposeShipmentEvent(eventData);

        // Approve event as verifier
        vm.prank(verifier);
        vm.expectEmit(true, true, true, true);
        emit shipmentEventApproved(1, 1, package, verifier);
        supplyChain.approveShipmentEvent(package);
    }

    function test_DenyShipment() public {
        // Setup shipment
        vm.prank(admin);
        supplyChain.createShipment(package, receiver);
        vm.prank(verifier);
        supplyChain.startShipment(package);

        // Deny shipment as admin
        vm.prank(admin);
        vm.expectEmit(true, true, true, true);
        emit shipmentUnderReview(1, package, admin);
        supplyChain.denyShipment(package);
    }

    function test_AcceptShipment() public {
        // Setup shipment
        vm.prank(admin);
        supplyChain.createShipment(package, receiver);
        vm.prank(verifier);
        supplyChain.startShipment(package);

        // Accept shipment as receiver
        vm.prank(receiver);
        vm.expectEmit(true, true, true, true);
        emit shipmentAccepted(1, package, receiver);
        supplyChain.acceptShipment(package);
    }

    function test_RevertWrongReceiver() public {
        // Setup shipment
        vm.prank(admin);
        supplyChain.createShipment(package, receiver);
        vm.prank(verifier);
        supplyChain.startShipment(package);

        // Try to accept shipment as wrong receiver
        address wrongReceiver = makeAddr("wrongReceiver");
        vm.prank(wrongReceiver);
        vm.expectRevert("SUPPLY_CHAIN: You are not the receiver");
        supplyChain.acceptShipment(package);
    }

    function test_EncodeDecodeShipmentEvent() public view {
        string memory location = "New York";
        uint temperature = 20;
        uint humidity = 65;

        bytes memory encoded = supplyChain.encodeShipmentEvent(
            location,
            temperature,
            humidity
        );
        (
            string memory decodedLocation,
            uint decodedTemp,
            uint decodedHumidity
        ) = supplyChain.decodeShipmentEvent(encoded);

        assertEq(decodedLocation, location);
        assertEq(decodedTemp, temperature);
        assertEq(decodedHumidity, humidity);
    }

    function test_RevertDoubleProposal() public {
        // Setup shipment
        vm.prank(admin);
        supplyChain.createShipment(package, receiver);
        vm.prank(verifier);
        supplyChain.startShipment(package);

        bytes memory eventData = supplyChain.encodeShipmentEvent(
            "New York",
            20,
            65
        );

        // First proposal
        vm.prank(package);
        supplyChain.proposeShipmentEvent(eventData);

        // Second proposal should fail
        vm.prank(package);
        vm.expectRevert("SUPPLY_CHAIN: An event has already been proposed");
        supplyChain.proposeShipmentEvent(eventData);
    }
}
