import React, { Component } from "react";
import getWeb3 from "./util/getWeb3";
import { userAddress, userProfile } from "./util/context";
import { bindAll } from "lodash";
import Header from "./components/header"

// Styles
import "./css/index.css"
import "./css/header.css"
import "./css/article_list.css"
import "./css/article.css"
import "./css/edit_article.css"

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

  renderLoading() {
    return(
      <main>
        <h1>Loading...</h1>
        <p>Currently trying to connect to web3 and find your user account. You may need to log in or switch to a web3-enabled browser!</p>
      </main>
    )
  }

  render() {
    return(
      <userAddress.Provider value={this.state.userAddress}>
        <userProfile.Provider value={this.profileContext()}>
          <div className="App">
            <Header />
            {this.loading() ? this.renderLoading() : this.props.children}
          </div>
        </userProfile.Provider>
      </userAddress.Provider>
    );
  }
}

export default App
