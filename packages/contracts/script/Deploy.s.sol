// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PropertyRecord.sol";

contract DeployPropertyRecord is Script {

  function run() external {
    uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

    vm.startBroadcast(deployerKey);
    PropertyRecord record = new PropertyRecord();
    vm.stopBroadcast();

    console.log("PropertyRecord deployed to:", address(record));
    console.log("Copy this into .env as CONTRACT_ADDRESS");
  }
}