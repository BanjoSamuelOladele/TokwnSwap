// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IWizT {
    function totalSupply() external view returns(uint);
    function balanceOf(address addr) external view returns (uint);
    function transfer(address to, uint amount) external;
    function approve(address addr, uint amount) external;
    function allowance(address realOwner, address spender) external view returns (uint);
    function transferFrom(address realOwner, address to, uint amount) external;
}