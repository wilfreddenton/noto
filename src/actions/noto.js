import {
  NOTO_WRITE_ACTION,
  NOTO_RAW_ACTION,
  NOTO_CREATE_ACTION,
  NOTO_DELETE_ACTION,
  NOTO_SELECT_ACTION,
  NOTO_BLOCKS_ACTION,
  NOTO_JOIN_ACTION } from '../constants/ActionTypes'

export function notoWriteAction(id, text) {
  return {
    type: NOTO_WRITE_ACTION,
    id: id,
    text: text
  }
}

export function notoJoinAction(fromID, toID, fromText) {
  return {
    type: NOTO_JOIN_ACTION,
    fromID: fromID,
    toID: toID,
    fromText: fromText
  }
}

export function notoRawAction(raw) {
  return {
    type: NOTO_RAW_ACTION,
    raw: raw
  }
}

export function notoCreateAction(id, toID, value='') {
  return {
    type: NOTO_CREATE_ACTION,
    id: id,
    toID: toID,
    value: value
  }
}

export function notoDeleteAction(id) {
  return {
    type: NOTO_DELETE_ACTION,
    id: id
  }
}

export function notoSelectAction(id, cursorPos=-0.5) {
  return {
    type: NOTO_SELECT_ACTION,
    id: id,
    cursorPos: cursorPos
  }
}

export function notoBlocksAction(blocks) {
  return {
    type: NOTO_BLOCKS_ACTION,
    blocks: blocks
  }
}

