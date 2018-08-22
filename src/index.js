import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Router, Route, IndexRoute, browserHistory } from "react-router";
// Components
// import LogIn from "./components/log_in"
// import NewArticle from "./components/new_article"
import ArticleList from "./components/article_list"
import Article from "./components/article"
import NewArticle from "./components/new_article"


ReactDOM.render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        {/*<Route path="login" component={LogIn} />*/}
        <Route path="articles/new" component={NewArticle} />
        <Route path="articles/:id" component={Article} />
        <IndexRoute component={ArticleList} />
      </Route>
    </Router>
  ),
  document.getElementById('root')
);
