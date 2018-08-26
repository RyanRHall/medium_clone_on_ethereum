import React, { Component } from "react";
import { browserHistory } from "react-router";
import { bindAll, range } from "lodash";
import connectToContract from "./connect_to_contract";

const selectOptions = range(1, 11).map(n => <option key={n} value={n}>{n}</option>);

class Article extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ["getArticleFromId", "getArticleProperties", "handleUpVoteChange", "handleSupportClick", "handleDeleteArticleClick", "handleEditArticleClick", "handleRedirectOnDelete"])
    this.state = {
      title: null,
      body: null,
      authorName: null,
      author : null,
      points : null,
      upVote: 1
    }
    props.connectContract("Medium", { ready: this.getArticleFromId });
  }

  // helpers
  routeId() {
    return parseInt(this.props.routeParams.id, 10);
  }

  // getters
  async getArticleFromId() {
    const id = parseInt(this.props.routeParams.id, 10);
    const articleAddress = await this.props.contracts.Medium.articleAddresses(id);
    this.props.connectContract("Article", {
      address: articleAddress,
      ready: this.getArticleProperties,
      watch: {
        updated: this.getArticleProperties,
        deleted: this.handleRedirectOnDelete
      }
    });
  }

  async getArticleProperties() {
    const title = await this.props.contracts.Article.title();
    const body = await this.props.contracts.Article.body();
    const authorName = await this.props.contracts.Article.authorName();
    const points = (await this.props.contracts.Article.points()).toNumber();
    const author = await this.props.contracts.Article.author();
    this.setState({ title, body, authorName, points, author });
  }

  // event handlers
  handleUpVoteChange(event) {
    this.setState({ upVote: parseInt(event.currentTarget.value, 10) });
  }

  handleDeleteArticleClick() {
    if(confirm("Are you sure you want to delete this Article?")) {
      this.props.contracts.Article.destroy({ from: this.props.userAddress, gas: 1 000000 });
    }
  }

  handleEditArticleClick() {
    browserHistory.push(`/articles/${this.props.routeParams.id}/edit`)
  }

  handleSupportClick(event) {
    const id = parseInt(this.props.routeParams.id, 10);
    this.props.contracts.Medium.upVote(id, { from: this.props.userAddress, value: `${this.state.upVote * 10000000000000000}` });
  }

  handleRedirectOnDelete(_, properties) {
    const id = properties.args.id.toNumber();
    if(id === this.routeId()) {
      browserHistory.push(`/`);
    }
  }

  // rendering
  renderDeleteArticleButton() {
    return <div key="1" id="delete-article-button" onClick={this.handleDeleteArticleClick}>Delete Article</div>
  }

  renderEditArticleButton() {
    return <div key="2" id="edit-article-button" onClick={this.handleEditArticleClick}>Edit Article</div>
  }

  renderUpVote() {
    return [
      <div key="1">{this.state.points}</div>,
      <select key="2" value={this.state.upVote} onChange={this.handleUpVoteChange}>{selectOptions}</select>,
      <div key="3" id="support-article-button" onClick={this.handleSupportClick}>Support!</div>
    ]
  }

  renderNav() {
    if(!this.state.author) { return null; }
    if(this.state.author === this.props.userAddress) {
      return [
        this.renderDeleteArticleButton(),
        this.renderEditArticleButton()
      ]
    } else {
      return this.renderUpVote()
    }
  }

  render() {
    return(
      <main>
        <nav>{this.renderNav()}</nav>
        <h1>{this.state.title}</h1>
        <h4>by {this.state.authorName}</h4>
        <div id="article-body">{this.state.body}</div>
      </main>
    )
  }

}

export default connectToContract(Article)
