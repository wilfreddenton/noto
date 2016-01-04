import { combineReducers } from 'redux'
import example from './example'
import notoBlocks from './noto-blocks'
import notoRaw from './noto-raw'
import notoEditor from './noto-editor'
import posts from './posts'

const rootReducer = combineReducers({
	example,
  notoBlocks,
  notoRaw,
  notoEditor,
  posts
})

export default rootReducer
