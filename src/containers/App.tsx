import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


import Stock from 'containers/Stock';
import GoldenLayoutWrapper from 'containers/GoldenLayoutWrapper';
import Test from 'containers/Test';
import Account from 'containers/Account';

class App extends React.Component {

  render() {
    return <Router>
      <Switch>
        <Route path="/stock" component={Stock} />
        <Route path="/stickies" component={GoldenLayoutWrapper} />
        <Route path="/test" component={Test} />
        <Route path="/account" component={Account} />
        <Route path="/" component={LinkList} />
      </Switch>
    </Router>
  }
}


export default App

class LinkList extends React.Component {
  render() {
    return <ul>
      <li>
        <Link to="/stock">Stock</Link>
      </li>
      <li>
        <Link to="/stickies">Stickies</Link>
      </li>
      <li>
        <Link to="/test">test</Link>
      </li>
      <li>
        <Link to="/account">Account</Link>
      </li>
    </ul>
  }
}
