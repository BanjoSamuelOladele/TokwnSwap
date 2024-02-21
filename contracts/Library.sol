// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IWizT.sol";

library Library {

    function swapTokenAToTokenB(uint _amount, IWizT tokenA, IWizT tokenB, uint tokenARate, uint tokenBRate, uint swapRate) external {
        checker(_amount);
        uint actualAmount = calculatePercentage(_amount, swapRate);
        require(tokenA.balanceOf(msg.sender) >= actualAmount, "you do do not have the enough balance to complete this transaction");
        tokenA.transferFrom(msg.sender, address(this), actualAmount);
        uint amount = (_amount / tokenARate) * tokenBRate;
        tokenB.transfer(msg.sender, amount);
    }

    function checker(uint _amount) private {
        require(msg.sender != address(0), "address zero detected");
        require(_amount > 0, "cannot perform zero amount transaction");
    }

    function calculatePercentage(uint _amount,  uint swapRate) private view returns(uint actual){
        uint percentage = (_amount * swapRate) / 100;
        actual = percentage + _amount;
        return actual;
    }

    function swapTokenBToTokenA(uint _amount, IWizT tokenB, IWizT tokenA, uint tokenARate, uint tokenBRate, uint swapRate) external {
        checker(_amount);
        uint actualAmount = calculatePercentage(_amount, swapRate);
        require(tokenB.balanceOf(msg.sender) >= actualAmount, "you do do not have the enough balance to complete this transaction");
        tokenB.transferFrom(msg.sender, address(this), actualAmount);
        uint amount = (_amount / tokenBRate) * tokenARate;
        tokenA.transfer(msg.sender, amount);
    }
}
