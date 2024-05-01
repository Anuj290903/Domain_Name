import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Search from './components/Search'
import Domain from './components/Domain'

// ABIs
import DomainName from './abis/DomainName.json'

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [domainName, setdomainName] = useState(null)
  const [domains, setDomains] = useState([])

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    console.log(provider)

    const network = await provider.getNetwork()
    console.log(network)

    const chainConfig = config[network.chainId];
    if (!chainConfig) {
      console.error(`Configuration for chain ID ${network.chainId} not found in config.json`);
      return;
    }
    const domainName = new ethers.Contract(chainConfig.DomainName.address, DomainName, provider);
    // const domainName = new ethers.Contract(config[network.chainId].DomainName.address, DomainName, provider)

    setdomainName(domainName)
    // console.log(domainName)

    const name = await domainName.name()
    // console.log(name)
    
    const maxSupply = await domainName.maxSupply()
    const domains = []

    for (var i = 1; i <= maxSupply; i++) {
      const domain = await domainName.getDomain(i)
      domains.push(domain)
    }

    setDomains(domains)

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account);
    })
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <Search />

      <div className='cards__section'>
        <h2 className='cards__title'>Why you need a domain name.</h2>
        <p className='cards__description'>
          Own your custom username, use it across services, and
          be able to store an avatar and other profile data.
        </p>

        <hr />

        <div className='cards'>
          {domains.map((domain, index) => (
            <Domain domain={domain} domainName={domainName} provider={provider} id={index + 1} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;