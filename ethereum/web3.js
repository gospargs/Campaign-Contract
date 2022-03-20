// this script gets exec. 2 times, one time on the server to initialy render our app, and second time in the browser

import Web3 from 'web3';
 
let web3;
 
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: 'eth_requestAccounts' });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/3d25ac5f70134fd9b88eea167b74c3e1'
  );
  web3 = new Web3(provider);
}
 
export default web3;