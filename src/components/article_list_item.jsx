import React, { Component } from "react";
import { browserHistory } from "react-router";
import { bindAll } from "lodash";
import connectToContract from "./connect_to_contract";

class Article extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ["getArticleProperties", "handleClick"])
    this.state = {
      title: "...",
      id: null
    };
    props.connectContract("Article", { address: props.address, ready: this.getArticleProperties })
  }

  async getArticleProperties() {
    const title = await this.props.contracts.Article.title();
    const id = await this.props.contracts.Article.id();
    this.setState({ title, id })
  }

  handleClick() {
    if(!this.state.id) { return }
    browserHistory.push(`/articles/${this.state.id}`)
  }

  render() {
    return(
      <div className="article-list-item" onClick={this.handleClick}>
        {this.state.title}
      </div>
    )
  }

}

export default connectToContract(Article);
