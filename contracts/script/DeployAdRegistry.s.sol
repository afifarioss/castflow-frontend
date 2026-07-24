// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {AdRegistry} from "../src/AdRegistry.sol";

contract DeployAdRegistry is Script {
    function run() external returns (AdRegistry) {
        vm.startBroadcast();
        AdRegistry registry = new AdRegistry();
        vm.stopBroadcast();
        return registry;
    }
}
