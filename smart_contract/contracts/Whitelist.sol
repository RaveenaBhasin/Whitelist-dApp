//SPDX-License-Identifier: Unlincense
pragma solidity ^0.8.0;

contract Whitelist {

    //maximum number of addresses which can be whitelisted
    uint8 public maxWhiteListedAddresses;

    //keep track of how many addresses have been whitelisted
    uint8 public numAddressesWhitelisted;

    mapping(address => bool) public whitelistedAddresses;

    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhiteListedAddresses = _maxWhitelistedAddresses;
    }

    function addAddressToWhitelist() public {
        require(!whitelistedAddresses[msg.sender], "Sender already in the whitelisted");
        require(numAddressesWhitelisted < maxWhiteListedAddresses, "Whitelist is full");

        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted++;

    }
}