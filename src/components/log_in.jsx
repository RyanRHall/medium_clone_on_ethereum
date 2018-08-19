import React, { Component } from "react";
import { Connect, SimpleSigner } from "uport-connect";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import { receiveUser } from "../action_creators/user_actions";

// CONSTANTS
const mnidAddress = '2oiFZa3ps2yNHZZkukXer56aJHjRRbyBTFK';
const signingKey = '551d1281388915da2f4744d0902a0942bee78f67a9f23fa72fd4f828f3b4ab58';
const appName = 'Decentralized Medium';

const uport = new Connect(appName, {
  clientId: mnidAddress,
  network: 'rinkeby',
  signer: SimpleSigner(signingKey)
})

// COMPONENT
class LogIn extends Component {
  async componentDidMount(){
    // Request credentials to login
    const { address, email, name } = await uport.requestCredentials({
      requested: ["name", "email"],
      notifications: true
    })
    this.props.receiveUser({ address, email, name })
    browserHistory.push("/")
  }

  render() {
    return(
      <main>
        <h1>Log In</h1>
      </main>
    )
  }
}

// CONTAINER
const mapStateToProps = state => ({
  thing: "yo"
});
const mapDispatchToProps = dispatch => ({
  receiveUser: user => dispatch(receiveUser(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogIn);
