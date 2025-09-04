// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

// Minimal mock for Ethereum Attestation Service (EAS) used in local testing
contract EASMock {
    // Stub for EAS attestation validation
    function attest(bytes32 /*schema*/, bytes32 /*uid*/, address /*to*/, bytes32 /*role*/) external pure returns (bool) {
        return true; // Always valid for local testing
    }

    // Stub for getting attestation
    function getAttestation(bytes32 /*uid*/) external pure returns (address, bytes32, uint64) {
        return (address(0), bytes32(0), 0);
    }
}
