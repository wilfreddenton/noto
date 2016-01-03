import {
  NOTO_CREATE_ACTION,
  NOTO_DELETE_ACTION,
  NOTO_SELECT_ACTION,
  NOTO_BLOCKS_ACTION } from '../constants/ActionTypes'

/*{
  editing: 0,
  blocks: {
    0: { content: "asdfasdf" },
    1: { content: "asdfasdfasdf" }
  },
}*/

  export default function notoEditor(state = {
    selectedID: 0,
    numBlocks: 1,
    cursorPos: 0
  }, action) {
  switch (action.type) {
    case NOTO_BLOCKS_ACTION: {
      return Object.assign({}, state, { numBlocks: action.blocks.length })
    }
    case NOTO_CREATE_ACTION: {
      const selectedID = action.toID ? action.toID : action.id + 1
      const numBlocks = state.numBlocks + 1
      const cursorPos = 0
      return { selectedID, numBlocks, cursorPos }
    }
    case NOTO_DELETE_ACTION: {
      const selectedID = (state.selectedID > 0) ? state.selectedID - 1 : 0
      const numBlocks = state.numBlocks - 1
      const cursorPos = -1
      return { selectedID, numBlocks, cursorPos }
    }
    case NOTO_SELECT_ACTION: {
      let selectedID = action.id
      if (action.id < 0) {
        selectedID = 0
      } else if (action.id > state.numBlocks - 1) {
        selectedID = state.numBlocks - 1
      }
      const cursorPos = action.cursorPos
      return Object.assign({}, state, { selectedID, cursorPos })
    }
    default:
      return state
  }
}

