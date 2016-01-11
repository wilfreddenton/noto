import { FETCH_POST_ACTION } from '../constants/ActionTypes'

export default function post(state = {}, action) {
  switch (action.type) {
    case FETCH_POST_ACTION:
      return action.post
    default:
      return state
  }
}
