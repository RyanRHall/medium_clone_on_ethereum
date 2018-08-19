import React, { Component } from "react";

class NewArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      body: ""
    }
  }

  handleChange(property) {
    return event => {
      this.setState({ [property]: event.target.value })
    }
  }

  handleSubmit(){

  }

  render() {
    return(
      <main>
        <h1>New Article</h1>
        <lable>Title</lable>
        <input onChange={this.handleChange("title")} />
        <lable>Body</lable>
        <textarea onChange={this.handleChange("body")} />
        <button onClick={this.handleSubmit}>Create Article</button>
      </main>
    )
  }
}

export default NewArticle;
