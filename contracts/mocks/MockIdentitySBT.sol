// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

// Minimal mock for ARC_IdentitySBT used in tests
// Exposes only the functions OCSH interacts with
contract MockIdentitySBT {
    mapping(address => mapping(bytes32 => bool)) public roles;
    mapping(address => uint256) public weights;

    function setRole(address who, bytes32 role, bool value) external {
        roles[who][role] = value;
    }

    function setWeight(address who, uint256 weight) external {
        weights[who] = weight;
    }

    function hasRole(address who, bytes32 role) external view returns (bool) {
        return roles[who][role];
    }

    function weightOf(address who) external view returns (uint256) {
        return weights[who];
    }

    function issue(address /*to*/, bytes32 /*role*/, bytes32 /*uid*/) external pure {}
}
