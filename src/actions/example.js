import { EXAMPLE_ACTION } from '../constants/ActionTypes'
import { delayPromise } from '../promises'

export function exampleAction() {
  return {
    type: EXAMPLE_ACTION
  }
}

export function exampleActionAsync() {
  return (dispatch) => {
    delayPromise(300).then(() => {
      dispatch(exampleAction())
    })
  }
}
