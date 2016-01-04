import { FETCH_POSTS_ACTION } from '../constants/ActionTypes'
import { posts } from '../mockData'

export function fetchPostsAction() {
  return {
    type: FETCH_POSTS_ACTION,
    posts: posts
  }
}
