import { FETCH_POSTS_ACTION, FETCH_POST_ACTION } from '../constants/ActionTypes'
import _ from 'lodash'
import { posts } from '../mockData'

export function fetchPostsAction() {
  return {
    type: FETCH_POSTS_ACTION,
    posts: posts
  }
}

export function fetchPostAction(unique) {
  return {
    type: FETCH_POST_ACTION,
    post: _.find(posts, (post) => post.unique === unique)
  }
}
