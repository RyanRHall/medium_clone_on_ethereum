import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Router, Route, IndexRoute, browserHistory } from "react-router";
// Components
import LogIn from "./components/log_in"
import ArticleList from "./components/article_list"
import Article from "./components/article"
import EditArticle from "./components/edit_article"


ReactDOM.render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="login" component={LogIn} />
        <Route path="articles/new" component={EditArticle} />
        <Route path="articles/:id/edit" component={EditArticle} />
        <Route path="articles/:id" component={Article} />
        <IndexRoute component={ArticleList} />
      </Route>
    </Router>
  ),
  document.getElementById('root')
);
