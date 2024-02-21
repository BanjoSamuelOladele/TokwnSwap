// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "./IWizT.sol";


contract WizT is IWizT {

    uint private tokenTotalSupply;

    mapping (address => uint) private balances;
    mapping (address => mapping (address => uint)) private allowedSpenderAmount;

    constructor(uint _totalSupply){
        tokenTotalSupply = _totalSupply;
        balances[msg.sender] = _totalSupply;
    }

    function totalSupply() external view returns (uint){
        return tokenTotalSupply;
    }

    function balanceOf(address addr) external view returns (uint){
        return balances[addr];
    }

    function transfer(address to, uint amount) external {
//        uint totalPay = amount + calculateBurnCharge(amount);
//        checker(balances[msg.sender], totalPay, to);
        checker(balances[msg.sender], amount, to);
        transferring(msg.sender, to, amount);
    }

    function transferring(address owner, address to, uint amount) private {
//        uint charge = calculateBurnCharge(amount);
//        balances[owner] = balances[owner] - (amount + charge);
        balances[owner] = balances[owner] - amount;
        balances[to] = balances[to] + amount;
//        balances[address(0)] = balances[address(0)] + charge;
//        tokenTotalSupply = tokenTotalSupply - charge;
    }

    function calculateBurnCharge(uint amount) private pure returns (uint){
        return amount * 10 / 100;
    }

    function approve(address addr, uint amount) external {
        checker(balances[tx.origin], amount, addr);
        allowedSpenderAmount[tx.origin][addr] = allowedSpenderAmount[tx.origin][addr] + amount;
    }

    function checker(uint balance, uint amount, address addr) private pure  {
        require(amount > 0, "Cannot send zero amount");
        require(balance >= amount, "Amount should equal or lesser than available balance");
        require(addr != address(0), "transfer to this address not allowed");
    }

    function allowance(address realOwner, address spender) external view returns (uint){
        return allowedSpenderAmount[realOwner][spender];
    }

    function transferFrom(address realOwner, address to, uint amount) external {
//        require(allowedSpenderAmount[realOwner][msg.sender] >= (amount + calculateBurnCharge(amount)), "exceed allowed transfer");
        require(allowedSpenderAmount[realOwner][msg.sender] >= amount, "exceed allowed transfer");
        transferring(realOwner, to, amount);
        allowedSpenderAmount[realOwner][msg.sender] = allowedSpenderAmount[realOwner][msg.sender] - amount;
    }
}
