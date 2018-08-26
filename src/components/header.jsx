import React, { Component } from "react";
import { browserHistory } from "react-router";
import connectToContract from "./connect_to_contract";
import { bindAll } from "lodash";


class Header extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ["handleLogInClick", "handleLogOutClick", "handleNewArticleClick"]);
  }

  // helpers
  loggedIn() {
    return(!!this.props.userProfile.name);
  }

  // event handlers
  handleLogInClick() {
    browserHistory.push("/login");
  }

  handleLogOutClick() {
    this.props.userProfile.logOut();
    browserHistory.push("/");
  }

  handleNewArticleClick() {
    browserHistory.push("/articles/new");
  }

  // rendering
  logInButton() {
    return(
      <div id="log-in-button" onClick={this.handleLogInClick}>Log In</div>
    )
  }

  userIcon() {
    return(
      <div id="user-icon" key="user-icon">
        <img src={this.props.userProfile.avatar} alt="avatar"/>
        <span>{this.props.userProfile.name}</span>
        <div id="user-icon-dropdown">
          <div onClick={this.handleLogOutClick}>Log Out</div>
        </div>
      </div>
    )
  }

  newArticleButton() {
    return(
      <div id="new-article-button" onClick={this.handleNewArticleClick} key="new-article-button">Publish New Article</div>
    )
  }

  render() {
    return(
      <header>
        {this.loggedIn() ? [this.newArticleButton(), this.userIcon()] : this.logInButton() }
      </header>
    )
  }
}

export default connectToContract(Header);
