import React, { Component } from "react";
import { browserHistory } from "react-router";
import { bindAll } from "lodash";
import connectToContract from "./connect_to_contract";

class NewArticle extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ["handleSubmit", "redirectToNewArticle", "getArticleFromId", "getArticleProperties", "redirectFromUpdate"]);
    this.state = {
      title: "",
      body: ""
    };
    if(this.isNewMode()) {
      props.connectContract("Medium", { watch: { posted: this.redirectToNewArticle } });
    } else {
      props.connectContract("Medium", { ready: this.getArticleFromId });
    }
  }

  // helpers
  isNewMode() {
    return !this.isEditMode();
  }

  isEditMode() {
    return !!this.props.location.pathname.match(/^\/articles\/\d*\/edit$/);
  }

  isLoggedIn() {
    return !!this.props.userProfile.name;
  }

  routeId() {
    return parseInt(this.props.routeParams.id, 10);
  }

  // getters
  async getArticleFromId() {
    const articleAddress = await this.props.contracts.Medium.articleAddresses(this.routeId());
    this.props.connectContract("Article", {
      address: articleAddress,
      ready: this.getArticleProperties,
      watch: { updated: this.redirectFromUpdate }
    });
  }

  async getArticleProperties() {
    const title = await this.props.contracts.Article.title();
    const body = await this.props.contracts.Article.body();
    this.setState({ title, body });
  }

  // event handlers
  handleChange(property) {
    return event => {
      this.setState({ [property]: event.target.value });
    }
  }

  handleSubmit() {
    if(this.isNewMode()) {
      if(this.isLoggedIn()) {
        this.props.contracts.Medium.post(this.state.title, this.state.body, this.props.userProfile.name, { from: this.props.userAddress });
      } else {
        alert("You must be logged in to post!");
      }
    } else {
      this.props.contracts.Article.patch(this.state.title, this.state.body, { from: this.props.userAddress });
    }
  }

  redirectFromUpdate(_, properties) {
    const id = properties.args.id.toNumber();
    if(id === this.routeId()) {
      browserHistory.push(`/articles/${id}`);
    }
  }

  redirectToNewArticle(_, properties) {
    // TODO - make sure this only redirects for article created by current user
    const id = properties.args.articleId.toNumber();
    browserHistory.push(`/articles/${id}`);
  }

  // renderers
  renderHeader() {
    return this.isNewMode() ? "New Article" : "Edit Article";
  }

  renderSubmitButtonText() {
    return this.isNewMode() ? "Create Article" : "Update Article";
  }

  render() {
    return(
      <main>
        <h1>{this.renderHeader()}</h1>
        <label>Title</label>
        <input onChange={this.handleChange("title")} value={this.state.title}/>
        <label>Body</label>
        <textarea onChange={this.handleChange("body")} value={this.state.body}/>
        <button onClick={this.handleSubmit}>{this.renderSubmitButtonText()}</button>
      </main>
    )
  }
}

export default connectToContract(NewArticle);
