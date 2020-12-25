import React, { lazy, Component, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Main from './pages/Main';
import AnimatedCubeExample from './pages/examples/AnimatedCubeExample';

const Vis = lazy(() => import('./componentes/Visualizacao'))

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
              <Main/>
            </Route>
            <Route path="/visualizacao">
              {<Vis/>}
            </Route>
          </Switch>
        </Router>
      </Suspense>
    );
  }
}

export default App;
