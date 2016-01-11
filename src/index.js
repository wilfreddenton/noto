require('./../assets/stylesheets/prism.static.css')
require('./../assets/scripts/prism.static.js')
import React from 'react'
import { render } from  'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'
import configureStore from './store/configureStore'
import createHashHistory from 'history/lib/createHashHistory'
import App from './containers/App'
import Noto from './components/Noto'
import NotoEditor from './components/NotoEditor'
import NotFound from './components/NotFound'
import Test from './components/Test'

const store = configureStore()
const history = createHashHistory()

const routes = (
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={Test} />
      <Route path="posts" component={Noto} />
      <Route path="posts/:unique/edit" component={Noto} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
)

render(
  <Provider store={store}>
    {routes}
  </Provider>,
  document.getElementById('app')
)

if (process.env.NODE_ENV !== 'production') {
  const showDevTools = require('./showDevTools').default
  showDevTools(store)
}

