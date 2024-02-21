// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./IWizT.sol";
//import "./Library.sol";

contract SwapToken {
    IWizT private tokenA;
    IWizT private tokenB;
    uint8 private tokenARate;
    uint8 private tokenBRate;
    uint8 private swapRate;

    constructor(address _tokenA, address _tokenB, uint8 _rateA, uint8 _rateB, uint8 _swapRate){
        tokenA = IWizT(_tokenA);
        tokenB = IWizT(_tokenB);
        tokenARate = _rateA;
        tokenBRate = _rateB;
        swapRate = _swapRate;
    }
    function swapToken(uint _amount, uint8 ab) external{
        require(ab > 0, "invalid input");
        require(ab <= 2, "input must be either 1 0r 2");
        if(ab == 1) swapTokenAToTokenB(_amount);
//        if(ab == 1) Library.swapTokenAToTokenB(_amount, tokenA, tokenB,tokenARate, tokenBRate, swapRate);
        else swapTokenBToTokenA(_amount);
//        else Library.swapTokenBToTokenA(_amount, tokenB, tokenA,tokenARate, tokenBRate, swapRate);
    }
    function swapTokenAToTokenB(uint _amount) private {
        checker(_amount);
        uint actualAmount = calculatePercentage(_amount);
        require(tokenA.balanceOf(msg.sender) >= actualAmount, "you do do not have the enough balance to complete this transaction");
        tokenA.transferFrom(msg.sender, address(this), actualAmount);
        uint amount = (_amount / tokenARate) * tokenBRate;
        tokenB.transfer(msg.sender, amount);
    }

    function checker(uint _amount) private {
        require(msg.sender != address(0), "address zero detected");
        require(_amount > 0, "cannot perform zero amount transaction");
    }

    function calculatePercentage(uint _amount) private view returns(uint actual){
        uint percentage = (_amount * swapRate) / 100;
        actual = percentage + _amount;
        return actual;
    }

    function swapTokenBToTokenA(uint _amount) private {
        checker(_amount);
        uint actualAmount = calculatePercentage(_amount);
        require(tokenB.balanceOf(msg.sender) >= actualAmount, "you do do not have the enough balance to complete this transaction");
        tokenB.transferFrom(msg.sender, address(this), actualAmount);
        uint amount = (_amount / tokenBRate) * tokenARate;
        tokenA.transfer(msg.sender, amount);
    }
}
