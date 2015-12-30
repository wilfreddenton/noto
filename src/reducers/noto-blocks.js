import {
  NOTO_WRITE_ACTION,
  NOTO_CREATE_ACTION,
  NOTO_DELETE_ACTION,
  NOTO_BLOCKS_ACTION } from '../constants/ActionTypes'

const newBlock = {
  text: ''
}

export default function notoBlocks(state = [
  { text: '' }
], action) {
  switch (action.type) {
    case NOTO_BLOCKS_ACTION:
      return action.blocks
    case NOTO_WRITE_ACTION: {
      let newState = [...state]
      newState[action.id].text = action.text
      return newState
    }
    case NOTO_CREATE_ACTION: {
      let newState = [...state]
      newState.splice(action.id + 1, 0, Object.assign({}, newBlock))
      return newState
    }
    case NOTO_DELETE_ACTION: {
      let newState = [...state]
      if (action.id !== 0)
        newState.splice(action.id, 1)
      return newState
    }
    default:
      return state
  }
}
