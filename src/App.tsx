import React, { lazy, Component, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import AnimatedCubeExample from './pages/examples/AnimatedCubeExample';
import 'bootstrap/dist/css/bootstrap.min.css';

const Main = lazy(() => import('./pages/Main'))

class App extends Component {
  render() {
    return (
      <Suspense fallback={'Loading....'}>
        <Router>
          <Switch>
            <Route path="/examples/AnimatedCubeExample">
              <AnimatedCubeExample/>
            </Route>
            <Route path="/">
              {<Main />}
            </Route>
          </Switch>
        </Router>
      </Suspense>
    );
  }
}

export default App;