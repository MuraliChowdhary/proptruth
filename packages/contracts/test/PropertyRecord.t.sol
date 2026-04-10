// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PropertyRecord.sol";

contract PropertyRecordTest is Test {

  PropertyRecord public record;

  function setUp() public {
    record = new PropertyRecord();
  }

  function test_AnchorReport() public {
    bytes32 propertyId = keccak256(abi.encodePacked("123 MG Road Bangalore"));
    record.anchorReport(propertyId, "QmTestCid123", 85, false);
    assertEq(record.getReportCount(propertyId), 1);
  }

  function test_RevertDuplicateSubmission() public {
    bytes32 propertyId = keccak256(abi.encodePacked("123 MG Road Bangalore"));
    record.anchorReport(propertyId, "QmCid1", 85, false);

    vm.expectRevert("Already submitted for this property");
    record.anchorReport(propertyId, "QmCid2", 90, false);
  }
}