import React, { lazy, Component, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import AnimatedCubeExample from 'pages/examples/AnimatedCubeExample';
import 'bootstrap/dist/css/bootstrap.min.css';

const CloudView = lazy(() => import('pages/cloud-view'))
const ApiTest = lazy(() => import('pages/api-test'))

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
            <Route path="/examples/AnimatedCubeExample">
              <AnimatedCubeExample />
            </Route>
            <Route path="/insert">
              {<CloudInsert />}
            </Route>
            <Route path="/edit/:id" component={CloudEdit}/>
            <Route path="/list">
              {<ListView />}
            </Route>
            <Route path="/cloud/:id" component={ListView} />
            <Route path="/api-test">
              {<ApiTest />}
            </Route>
            <Route path="/:id" component={SingleView}/>  
          </Switch>
        </Router>
      </Suspense>
    );
  }
}

export default App;
