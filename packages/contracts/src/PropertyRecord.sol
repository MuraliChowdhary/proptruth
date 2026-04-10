// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PropertyRecord {

  struct ConditionReport {
    string  ipfsCid;
    address submitter;
    uint256 timestamp;
    uint8   aiConfidence;
    bool    mismatchFlag;
  }

  mapping(bytes32 => ConditionReport[]) private propertyReports;
  mapping(bytes32 => mapping(address => bool)) private hasSubmitted;

  event ReportAnchored(
    bytes32 indexed propertyId,
    string  ipfsCid,
    address submitter,
    uint256 timestamp
  );

  function anchorReport(
    bytes32 propertyId,
    string calldata ipfsCid,
    uint8 aiConfidence,
    bool mismatchFlag
  ) external {
    require(
      !hasSubmitted[propertyId][msg.sender],
      "Already submitted for this property"
    );

    propertyReports[propertyId].push(ConditionReport({
      ipfsCid:      ipfsCid,
      submitter:    msg.sender,
      timestamp:    block.timestamp,
      aiConfidence: aiConfidence,
      mismatchFlag: mismatchFlag
    }));

    hasSubmitted[propertyId][msg.sender] = true;

    emit ReportAnchored(propertyId, ipfsCid, msg.sender, block.timestamp);
  }

  function getReports(bytes32 propertyId)
    external view
    returns (ConditionReport[] memory)
  {
    return propertyReports[propertyId];
  }

  function getReportCount(bytes32 propertyId)
    external view
    returns (uint256)
  {
    return propertyReports[propertyId].length;
  }
}