import Web3 from 'web3'

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function(dispatch) {
    let _web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      _web3 = new Web3(window.web3.currentProvider)
    } else {
      // Fallback to localhost if no web3 injection.
      let provider = new Web3.providers.HttpProvider('http://localhost:8545')
      _web3 = new Web3(provider)
    }
    resolve(_web3);
  })
})

export default getWeb3
