import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {ethers} from "hardhat";
import {expect, assert} from "chai";
import {Contract} from "ethers";


describe("Test for instances", ()=> {
    let deployContract: Contract;
    before(async () => {
        const TrialA = await ethers.getContractFactory("TrialA");
        deployContract = await TrialA.deploy();
    });

    describe("test for existence", ()=> {
        it("check if it is not empty", async ()=> {
            expect(deployContract).is.not.empty;
        });
        it("check that it is not null", async ()=> {
            assert.isNotNull(deployContract);
        });
        it("create instance and compare it", async ()=> {
            const instanceContract = deployContract.factoryInstance();
            expect(instanceContract).is.eq(deployContract);
        })
    });
})
