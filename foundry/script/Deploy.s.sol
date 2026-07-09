// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/AdRegistry.sol";
import "../src/AdAuction.sol";
import "../src/AdEscrow.sol";
import "../src/RevenueSplit.sol";
import "../src/RoyaltyManager.sol";

contract Deploy is Script {
    // Base Sepolia USDC
    address constant USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    // Owner / deployer (protocol fee receiver & ecosystem fund initially)
    address constant OWNER = 0x7845D45d9E53268EBFf3C4a9daBb994cE5b93918;

    function run() external {
        vm.startBroadcast();

        // 1. AdRegistry
        AdRegistry registry = new AdRegistry();

        // 2. RoyaltyManager
        RoyaltyManager royalty = new RoyaltyManager(USDC);

        // 3. RevenueSplit
        RevenueSplit splitter = new RevenueSplit(USDC, address(royalty), OWNER, OWNER);

        // 4. AdEscrow (temporary auction address = address(0))
        AdEscrow escrow = new AdEscrow(USDC, address(splitter), address(0));

        // 5. AdAuction
        AdAuction auction = new AdAuction(address(registry), USDC, address(escrow));

        // 6. Wire AdEscrow.setAuction(AdAuction)
        escrow.setAuction(address(auction));

        vm.stopBroadcast();

        // Log addresses for copy‑pasting into frontend .env.local
        console.log("=== Deployed Addresses ===");
        console.log("AdRegistry:", address(registry));
        console.log("RoyaltyManager:", address(royalty));
        console.log("RevenueSplit:", address(splitter));
        console.log("AdEscrow:", address(escrow));
        console.log("AdAuction:", address(auction));
    }
}