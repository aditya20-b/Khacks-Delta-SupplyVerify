// SPDX-License-Identifier: MIT
pragma solidity =0.8.20;

import "forge-std/Script.sol";
import "../src/MultisigSupplyChain.sol";

contract DeployMultisigSupplyChain is Script {
    function run() external {
        // Get deployment private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        MultisigSupplyChain supplyChain = new MultisigSupplyChain();

        // Setup initial roles if needed
        address admin = vm.envAddress("ADMIN_ADDRESS");
        address verifier = vm.envAddress("VERIFIER_ADDRESS");

        supplyChain.grantAdminRole(admin);
        supplyChain.grantVerifierRole(verifier);

        vm.stopBroadcast();

        // Log the deployed addresses
        console.log("MultisigSupplyChain deployed to:", address(supplyChain));
        console.log("Admin role granted to:", admin);
        console.log("Verifier role granted to:", verifier);
    }
}
