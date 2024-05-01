const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners()
  const NAME = "Domain Name"
  const SYMBOL = "BFSC"

  // Deploy contract
  const DomainName = await ethers.getContractFactory("DomainName")
  const domainName = await DomainName.deploy(NAME, SYMBOL)
  await domainName.deployed();

  console.log(`Deployed Domain Contract at: ${domainName.address}\n`)

  // List domains
  const names = ["Anuj.eth", "Palak.eth", "Jitendra.eth", "Laksh.eth", "Ranveer.eth", "Dhruv.eth"]
  const costs = [tokens(10), tokens(25), tokens(15), tokens(2.5), tokens(3), tokens(1)]

  for (var i = 0; i < 6; i++) {
    const transaction = await domainName.connect(deployer).list(names[i], costs[i])
    await transaction.wait()

    console.log(`Listed Domain ${i + 1}: ${names[i]}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
