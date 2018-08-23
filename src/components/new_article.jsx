import React, { Component } from "react";
import { browserHistory } from "react-router";
import { bindAll } from "lodash";
import connectToContract from "./connect_to_contract";

class NewArticle extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ["handleSubmit", "redirectToNewArticle"]);
    this.state = {
      title: "",
      body: ""
    };
    props.connectContract("Medium", { watch: { posted: this.redirectToNewArticle } });
  }

  handleChange(property) {
    return event => {
      this.setState({ [property]: event.target.value });
    }
  }

  handleSubmit() {
    this.props.contracts.Medium.post(this.state.title, this.state.body, { from: this.props.userAddress });
  }

  redirectToNewArticle(_, properties) {
    const id = properties.args.articleId.c[0];
    browserHistory.push(`/articles/${id}`);
  }

  render() {
    return(
      <main>
        <h1>New Article</h1>
        <label>Title</label>
        <input onChange={this.handleChange("title")} />
        <label>Body</label>
        <textarea onChange={this.handleChange("body")} />
        <button onClick={this.handleSubmit}>Create Article</button>
      </main>
    )
  }
}

export default connectToContract(NewArticle);
