import { expect, assert } from "chai";
import {ethers} from "hardhat";
import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {AddressLike} from "ethers";
import {ContractType} from "hardhat/internal/hardhat-network/stack-traces/model";


describe("Test Swap Token", ()=>{
    let iSwapToken;
    let owner, otherSigner;
    let iWizTA, iWizTB;

    beforeEach(async ()=>{
        const [_owner, _another] = await ethers.getSigners();

        const TokenA = await ethers.getContractFactory("WizT");
        const tokenA = await TokenA.deploy(10_000);
        const TokenB = await ethers.getContractFactory("WizT");
        const tokenB = await TokenB.deploy(10_000);

        const SwapToken = await ethers.getContractFactory("SwapToken");
        const swapToken = await SwapToken.deploy(tokenA.target, tokenB.target, 3, 1, 2);

        iWizTA = await ethers.getContractAt("IWizT", tokenA.target);
        iWizTB = await ethers.getContractAt("IWizT", tokenB.target);
        iSwapToken = await ethers.getContractAt("ISwapToken", swapToken.target);

        owner = _owner;
        otherSigner = _another;

        iWizTB.transfer(swapToken.target, 1_000);
        iWizTA.transfer(swapToken.target, 1_000);

    });

    describe("test all deployed", ()=>{
        it("test that the deployed swap token is not null", async ()=> {
            assert.isNotNull(iSwapToken);
        });
        it("test that the deployed tokenB and tokenA are not empty", async ()=>{
            assert.isNotEmpty(iWizTB);
            assert.isNotEmpty(iWizTA);
        });
    });

    describe("test swap", ()=> {
       it("test that token A can be swapped to token B which first checks the rates of each token and give the equivalent", async ()=>{
           await iWizTA.approve(iSwapToken.target, 200);
           await iSwapToken.swapToken(100, 1);

           const aTokenBal = await iWizTA.balanceOf(owner.address);
           const bTokenBal = await iWizTB.balanceOf(owner.address);

           assert.equal(aTokenBal, 8898);
           assert.equal(bTokenBal, 9033);
       });
       it("test that token B can be swapped to token A", async ()=>{
          await iWizTB.approve(iSwapToken.target, 200);
          await iSwapToken.swapToken(100, 2);

           const aTokenBal = await iWizTA.balanceOf(owner.address);
           const bTokenBal = await iWizTB.balanceOf(owner.address);

           assert.equal(aTokenBal, 9300);
           assert.equal(bTokenBal, 8898);
       });

       it("test that another account can also swap", async ()=>{
           await iWizTA.transfer(otherSigner.address, 200);
           await iWizTA.connect(otherSigner).approve(iSwapToken.target, 150);
           await iSwapToken.connect(otherSigner).swapToken(100, 1);

           const bal = await iWizTB.balanceOf(otherSigner.address);

           assert.equal(bal, 33);
       });
    });

    describe("test exchange", ()=>{
        // iSwapToken.changeTokenARate(2);
    })
})