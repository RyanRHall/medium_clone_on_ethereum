import React from "react";

export const userAddress = React.createContext();
export const withUserAddress = Component => props => (
  <userAddress.Consumer>
    {userAddress => <Component {...props} userAddress={userAddress}/>}
  </userAddress.Consumer>
)

export const web3 = React.createContext();
export const withWeb3 = Component => props => (
  <web3.Consumer>
    {web3 => <Component {...props} web3={web3}/>}
  </web3.Consumer>
)

export const userProfile = React.createContext();
export const withUserProfile = Component => props => (
  <userProfile.Consumer>
    {userProfile => <Component {...props} userProfile={userProfile}/>}
  </userProfile.Consumer>
)
