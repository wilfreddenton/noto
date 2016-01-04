import { NOTO_RAW_ACTION } from '../constants/ActionTypes'

export default function notoRaw(state = '', action) {
  switch(action.type) {
    case NOTO_RAW_ACTION:
      return action.raw
    default:
      return state
  }
}

