const { assert } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
/*
//in staging tests we are on testnet not on local hardhat.
// so, we need not do the deployment.fixtures here bczo we assume we alraedy have the contracts deployed
// so before u test on a testnet, we must have already deployed on to the testnet.
Then the getContract() understands that the recently deplyed contracts and hence
when we do the 
hh test --network rinkeby, then only these staging test will be executed bcoz of the conditions we have specified.
*/
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", async function () {
          let deployer
          let fundMe
          const sendValue = ethers.utils.parseEther("0.1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              const fundTxResponse = await fundMe.fund({ value: sendValue })
              await fundTxResponse.wait(1)
              const withdrawTxResponse = await fundMe.withdraw()
              await withdrawTxResponse.wait(1)

              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              console.log(
                  endingFundMeBalance.toString() +
                      " should equal 0, running assert equal..."
              )
              assert.equal(endingFundMeBalance.toString(), "0")
          })
      })
