import { NOTO_RAW_ACTION } from '../constants/ActionTypes'

export default function notoRaw(state = '# hello world\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus hendrerit, mi vitae efficitur cursus, quam massa maximus leo, nec scelerisque ligula nisl nec nibh. Suspendisse potenti. Fusce id egestas mauris. Etiam at neque nibh. Nullam ornare nibh nec lorem feugiat scelerisque. Integer luctus rutrum eleifend. Donec tincidunt orci eget est fermentum lobortis. Donec in erat id dui vestibulum ultricies. Nulla ultricies eget neque non bibendum. Quisque non aliquam arcu, a vulputate dui. Fusce viverra mattis tortor sed vulputate.', action) {
  switch(action.type) {
    case NOTO_RAW_ACTION:
      return action.raw
    default:
      return state
  }
}

