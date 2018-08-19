import React, { Component } from "react";
import { browserHistory } from "react-router";
import Article from "./article";
import connectToContract from "./connect_to_contract";
import { bindAll } from "lodash";


class ArticleList extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ["getArticleList"])
    this.state = {
      articleAddresses: []
    }
    props.setContractProperties({
      name: "Medium"
    })
    props.setEventListeners({
      userAndContractReady: this.getArticleList
    })
  }

  async getArticleList() {
    const articleIds = this.contract.getArticleIds();
    debugger
  }

  render() {
    return(
      <main>
        <h1>Medium</h1>
        {this.state.articleAddresses.map(address => <Article key={address} address={address} />)}
      </main>
    )
  }
}

const mapStateToProps = state => {
  return {}
  // accounts: state.accounts,
  // mediumInitialized: state.contracts.Medium.initialized,
}



export default connectToContract(ArticleList);
