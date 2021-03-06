import { combineReducers } from 'redux'
import example from './example'
import notoBlocks from './noto-blocks'
import notoRaw from './noto-raw'
import notoEditor from './noto-editor'
import posts from './posts'
import post from './post'

const rootReducer = combineReducers({
	example,
  notoBlocks,
  notoRaw,
  notoEditor,
  posts,
  post
})

export default rootReducer
