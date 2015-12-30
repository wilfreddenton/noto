import { Promise } from 'rsvp'

export function delayPromise(time) {
  return new Promise(resolve => {
    setTimeout(function() {
      resolve()
    }, time)
  })
}
