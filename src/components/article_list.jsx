import React, { Component } from "react";
import ArticleListItem from "./article_list_item";
import connectToContract from "./connect_to_contract";
import { bindAll } from "lodash";


class ArticleList extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ["getArticleList"]);
    this.state = {
      articleAddresses: []
    };
    props.connectContract("Medium", { ready: this.getArticleList });
  }

  async getArticleList() {
    const articleAddresses = await this.props.contracts.Medium.getArticleAddresses();
    this.setState({ articleAddresses });
  }

  render() {
    return(
      <main>
        <h1>Articles</h1>
        {this.state.articleAddresses.map(address => <ArticleListItem key={address} address={address} />)}
      </main>
    )
  }
}

export default connectToContract(ArticleList);
