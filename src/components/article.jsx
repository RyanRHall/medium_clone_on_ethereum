import React, { Component } from "react";
import connectToContract from "./connect_to_contract";
import { bindAll } from "lodash";

class Article extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ["getArticleFromId", "getArticleProperties"])
    this.state = {
      title: "",
      body: ""
    }
    props.connectContract("Medium", { ready: this.getArticleFromId });
  }

  async getArticleFromId() {
    const id = parseInt(this.props.routeParams.id);
    const articleAddress = await this.props.contracts.Medium.articleAddresses(id);
    this.props.connectContract("Article", { address: articleAddress, ready: this.getArticleProperties });
  }

  async getArticleProperties() {
    const title = await this.props.contracts.Article.title();
    const body = await this.props.contracts.Article.body();
    this.setState({ title, body });
  }

  render() {
    return(
      <main>
        <h1>{this.state.title}</h1>
        <div id="article-body">{this.state.body}</div>
      </main>
    )
  }

}

export default connectToContract(Article)
