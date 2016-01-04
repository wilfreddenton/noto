import { FETCH_POSTS_ACTION } from '../constants/ActionTypes'

export default function posts(state = [], action) {
  switch (action.type) {
    case FETCH_POSTS_ACTION:
      return action.posts
    default:
      return state
  }
}
