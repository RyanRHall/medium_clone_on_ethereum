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
      body: "",
      loading: false
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
    const articleAddress = await this.props.contracts.Medium.getArticleFromId(this.routeId());
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

  async handleSubmit() {
    if(this.isNewMode()) {
      if(this.isLoggedIn()) {
        await this.props.contracts.Medium.post(this.state.title, this.state.body, this.props.userProfile.name, { from: this.props.userAddress });
        this.setState({ loading: true });
      } else {
        alert("You must be logged in to post!");
      }
    } else {
      await this.props.contracts.Article.patch(this.state.title, this.state.body, { from: this.props.userAddress });
      this.setState({ loading: true });
    }
  }

  redirectFromUpdate(_, properties) {
    const id = properties.args.id.toNumber();
    if(id === this.routeId()) {
      browserHistory.push(`/articles/${id}`);
    }
  }

  redirectToNewArticle(_, properties) {
    if(properties.args.author === this.props.userAddress) {
      const id = properties.args.articleId.toNumber();
      browserHistory.push(`/articles/${id}`);
    }
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
      <main id="edit-article">
        <h1>{this.renderHeader()}</h1>
        <div className="row">
          <label>Title:</label>
          <input onChange={this.handleChange("title")} value={this.state.title} disabled={this.state.loading}/>
        </div>
        <div className="row">
          <label>Body:</label>
          <textarea onChange={this.handleChange("body")} value={this.state.body} disabled={this.state.loading}/>
        </div>
        <div className="row">
          <button onClick={this.handleSubmit} disabled={this.state.loading}>{this.renderSubmitButtonText()}</button>
        </div>
      </main>
    )
  }
}

export default connectToContract(NewArticle);
