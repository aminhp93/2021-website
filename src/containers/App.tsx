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
          <Route path="/stock">
            <Stock/>
          </Route>
          <Route path="/note">
            {/* <Note /> */}
            <div>Note</div>
          </Route>
          <Route path="/stickies">
            <GoldenLayoutWrapper />
          </Route>
          <Route path="/">
            <nav className="App-nav">
              <ul>
                <li>
                  <Link to="/stock">Stock</Link>
                </li>
                <li>
                  <Link to="/note">Note</Link>
                </li>
                <li>
                  <Link to="/stickies">Stickies</Link>
                </li>
              </ul>
            </nav>
          </Route>
        </Switch>
      </Router>
    }
}

export default App
