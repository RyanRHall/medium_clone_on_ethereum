import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Router, Route, IndexRoute, browserHistory } from "react-router";


ReactDOM.render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        {/*<Route path="login" component={LogIn} />*/}
        {/*<Route path="articles/new" component={NewArticle} />*/}
        {/*<IndexRoute component={ArticleList} />*/}
      </Route>
    </Router>
  ),
  document.getElementById('root')
);
