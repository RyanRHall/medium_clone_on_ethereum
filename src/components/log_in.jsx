import React, { Component } from "react";
import { browserHistory } from "react-router";
import { Connect, SimpleSigner } from "uport-connect";
import connectToContract from "./connect_to_contract";

// CONSTANTS
const mnidAddress = "2oiFZa3ps2yNHZZkukXer56aJHjRRbyBTFK";
const signingKey = "551d1281388915da2f4744d0902a0942bee78f67a9f23fa72fd4f828f3b4ab58";
const appName = "Decentralized Medium";

const uport = new Connect(appName, {
  clientId: mnidAddress,
  network: 'rinkeby',
  signer: SimpleSigner(signingKey)
})

// COMPONENT
class LogIn extends Component {
  async componentDidMount(){
    // Request credentials to login
    const { email, name, avatar } = await uport.requestCredentials({
      requested: ["name", "email", "avatar"],
      notifications: true
    })
    this.props.userProfile.receiveUser({ email, name, avatar: avatar.uri })
    browserHistory.push("/")
  }

  render() {
    return(
      <main>
      </main>
    )
  }
}

export default connectToContract(LogIn);
