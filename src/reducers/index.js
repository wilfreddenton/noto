import { combineReducers } from 'redux'
import example from './example'
import notoBlocks from './noto-blocks'
import notoRaw from './noto-raw'
import notoEditor from './noto-editor'

const rootReducer = combineReducers({
	example,
  notoBlocks,
  notoRaw,
  notoEditor
})

export default rootReducer
