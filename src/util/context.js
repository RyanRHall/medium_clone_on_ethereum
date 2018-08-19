import React from "react";

export const userAddress = React.createContext(undefined);
export const withUserAddress = Component => props => (
  <userAddress.Consumer>
    {userAddress => <Component {...props} userAddress={userAddress}/>}
  </userAddress.Consumer>
)

export const web3 = React.createContext(null);
export const withWeb3 = Component => props => (
  <web3.Consumer>
    {web3 => <Component {...props} web3={web3}/>}
  </web3.Consumer>
)
