import React, { Component } from "react";
import getWeb3 from "./util/getWeb3";
import { userAddress, web3, userProfile } from "./util/context";


// Styles
import "./css/oswald.css"
import "./css/open-sans.css"
import "./css/pure-min.css"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userAddress: undefined,
      web3: null,
      userProfile: {
        firstName: null,
        lastName: null,
        email: null
      }
    };
    this.setup();
  }

  async setup() {
    const web3 = await getWeb3;
    web3.eth.getAccounts((error, accounts) => {
      const userAddress = accounts[0] || null;
      this.setState({
        userAddress: userAddress,
        web3: web3
      });
    });
  }

  receiveUser() {
    debugger
  }

  loading() {
    return !this.state.userAddress || !this.state.web3
  }

  render() {
    return(
      <web3.Provider value={this.state.web3}>
        <userAddress.Provider value={this.state.userAddress}>
          <userProfile.Provider value={this.state.userProfile}>
            <div className="App">
              {this.loading() ? "Loading" : this.props.children}
            </div>
          </userProfile.Provider>
        </userAddress.Provider>
      </web3.Provider>
    );
  }
}

export default App
