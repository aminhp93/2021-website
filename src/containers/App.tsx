import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


import Stock from 'containers/Stock';
import GoldenLayoutWrapper from 'containers/GoldenLayoutWrapper';

class App extends React.Component {

    render() {
        return <Router>
        <Switch>
          <Route path="/stock" component={Stock} />
          <Route path="/stickies" component={GoldenLayoutWrapper} />
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
  </ul>
  }
}
