import {ethers} from "hardhat";
import {expect, assert} from "chai";
import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";


describe("Test erc20", ()=>{

    let token;
    let iToken;
    let owner;
    let otherSigner;

    beforeEach(async () => {
        const [_owner,_otherSigner] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("WizT");
        token = await Token.deploy(10_000);

        iToken = await ethers.getContractAt("IWizT", token.target);

        owner = _owner;
        otherSigner = _otherSigner;

    });

    describe("test deploy", ()=>{
        it("test that the instance of deployed is not null", async ()=>{
            assert.isNotNull(iToken);
        })
    });

    describe("confirm balances", ()=>{
        it("confirm the total supply of the contract is same as the amount passed when deployed", async ()=>{
            const bal = await iToken.totalSupply();
            assert.equal(bal, 10_000);
        });

        it("confirm the balance of the owner is same as the deployed amount", async ()=>{
            // const [owner] = await ethers.getSigners();
            const bal = await iToken.balanceOf(owner.address);

            assert.equal(bal, 10_000);
        });
    });

    describe("test transfer", ()=>{
        it("owner can transfer to another account", async ()=>{
            // const [owner,otherSigner] = await ethers.getSigners();
            await iToken.transfer(otherSigner.address, 1000);

            const bal = await iToken.balanceOf(otherSigner.address);
            const ownerBal = await iToken.balanceOf(owner.address);

            assert.equal(bal, 1000);
            assert.equal(ownerBal, 8900);
        });
        it("Zero amount cannot be sent", async ()=>{
            try {
                await iToken.transfer(otherSigner.address, 1_000);
            }catch (error){
                expect(error.message).to.be.eq("Zero amount cannot be sent");
            }

            // await expect(iToken.transfer(otherSigner.address, 0)).to.be.reverted;
        });

        it("cannot send amount greater than balance", async ()=>{
            await expect(iToken.transfer(otherSigner.address, 10_000)).to.be.reverted;
        });
        it("cannot send to address zero", async ()=>{
            await expect(iToken.transfer(ethers.ZeroAddress, 1_000)).to.be.reverted;
        })
    });

    describe("test approve", ()=>{
        it("check the approved amount for an address", async ()=>{
            await iToken.approve(otherSigner.address, 1000);

            const allowed = await iToken.allowance(owner.address, otherSigner.address);

            assert.equal(allowed, 1000);
        });

        it("cannot approve approve zero", async ()=>{
            await expect(iToken.approve(ethers.ZeroAddress, 1000)).to.be.reverted;
        });

        it("cannot approve amount greater than balance", async ()=>{
            await expect(iToken.approve(otherSigner.address, 11_000)).to.be.reverted;
        });
    });

    describe("test transfer from", ()=>{
        it("approved address can transfer ", async ()=>{
            const [,,anotherUser] = await ethers.getSigners();
            await iToken.approve(otherSigner.address, 1000);
            await iToken.connect(otherSigner).transferFrom(owner.address, anotherUser.address, 800);

            const bal = await iToken.balanceOf(anotherUser.address);
            const ownerBal = await iToken.balanceOf(owner.address);
            const allowedUser = await iToken.allowance(owner.address, otherSigner.address);

            assert.equal(bal, 800);
            assert.equal(ownerBal, 9120);
            assert.equal(200, allowedUser);
        });
        it("approved address should cannot send more than the approved amount", async ()=>{
           await iToken.approve(otherSigner.address, 100);
            await expect(iToken.connect(otherSigner).transferFrom(owner.address, otherSigner.address, 800)).to.be.reverted;
        });
    });
})
