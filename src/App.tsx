import React, { lazy, Component, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import AnimatedCubeExample from 'pages/examples/AnimatedCubeExample';
import 'bootstrap/dist/css/bootstrap.min.css';

const ListView = lazy(() => import('pages/list-view'))

const SingleView = lazy(() => import('pages/single-cloud-view'))

const CloudInsert = lazy(() => import('pages/cloud-insert'))

const CloudEdit = lazy(() => import('pages/cloud-edit'))

class App extends Component {
  render() {
    return (
      <Suspense fallback={'Loading....'}>
        <Router>
          <Switch>
            <Route path="/examples/AnimatedCubeExample" component={AnimatedCubeExample} />
            <Route path="/clouds/list" component={ListView} />
            <Route path="/clouds/insert" component={CloudInsert} />
            <Route path="/clouds/view/:id" component={SingleView} />
            <Route path="/clouds/edit/:id" component={CloudEdit} />
            <Route path="/" exact>
              <Redirect to="/clouds/list" />
            </Route>
            <Route path="/clouds" exact>
              <Redirect to="/clouds/list" />
            </Route>
            <Route path="/list" exact>
              <Redirect to="/clouds/list" />
            </Route>
          </Switch>
        </Router>
      </Suspense>
    );
  }
}

export default App;
