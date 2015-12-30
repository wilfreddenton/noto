import { createStore, applyMiddleware, compose } from 'redux'
import { persistState } from 'redux-devtools'
import rootReducer from '../reducers'
import DevTools from '../components/DevTools'

const finalCreateStore = compose(
	applyMiddleware(),
	DevTools.instrument(),
	persistState(getDebugSessionKey())
)(createStore)

function getDebugSessionKey() {
	const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/)
  return (matches && matches.length > 0)? matches[1] : null
}

export default function configureStore(initialState) {
	const store = finalCreateStore(rootReducer, initialState)
	if (module.hot) {
		module.hot.accept('../reducers', () =>
			store.replaceReducer(require('../reducers'))
		)
	}
	return store
}
