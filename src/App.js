import React, { Component } from "react";
import getWeb3 from "./util/getWeb3";
import { userAddress, userProfile } from "./util/context";
import { bindAll } from "lodash";
import Header from "./components/header"

// Styles
import "./css/oswald.css"
import "./css/open-sans.css"
import "./css/pure-min.css"

const defaultUserProfileState = {
  name: null,
  avatar: null,
  email: null
};

class App extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ["logOut", "receiveUser"])
    this.state = {
      userAddress: undefined,
      web3: null,
      userProfile: defaultUserProfileState
    };
    this.setup();
  }

  async setup() {
    // get web3
    const web3 = await getWeb3;
    // get eth account
    web3.eth.getAccounts((error, accounts) => {
      const userAddress = accounts[0] || null;
      this.setState({
        userAddress: userAddress,
        web3: web3
      });
    });
    // get signed in user
    const userProfile = JSON.parse(sessionStorage.getItem("userProfile"));
    if(userProfile) {
      this.setState({ userProfile });
    }
  }

  logOut() {
    this.setState({ userProfile: defaultUserProfileState});
    sessionStorage.removeItem("userProfile");
  }

  receiveUser(userProfile) {
    this.setState({ userProfile });
    sessionStorage.setItem("userProfile", JSON.stringify(userProfile));
  }

  profileContext() {
    return {
      ...this.state.userProfile,
      receiveUser: this.receiveUser,
      logOut: this.logOut
    }
  }

  loading() {
    return !this.state.userAddress || !this.state.web3
  }

  render() {
    return(
      <userAddress.Provider value={this.state.userAddress}>
        <userProfile.Provider value={this.profileContext()}>
          <div className="App">
            <Header />
            {this.loading() ? "Loading" : this.props.children}
          </div>
        </userProfile.Provider>
      </userAddress.Provider>
    );
  }
}

export default App
