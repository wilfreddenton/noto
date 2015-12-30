import {
  NOTO_CREATE_ACTION,
  NOTO_DELETE_ACTION,
  NOTO_SELECT_ACTION } from '../constants/ActionTypes'

/*{
  editing: 0,
  blocks: {
    0: { content: "asdfasdf" },
    1: { content: "asdfasdfasdf" }
  },
}*/

export default function notoEditor(state = 0, action) {
  switch (action.type) {
    case NOTO_CREATE_ACTION:
      return state + 1
    case NOTO_DELETE_ACTION:
      return (state > 0) ? state - 1 : 0
    case NOTO_SELECT_ACTION:
      return action.id
    default:
      return state
  }
}

