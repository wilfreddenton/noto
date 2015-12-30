import {
  NOTO_WRITE_ACTION,
  NOTO_RAW_ACTION,
  NOTO_CREATE_ACTION,
  NOTO_DELETE_ACTION,
  NOTO_SELECT_ACTION,
  NOTO_BLOCKS_ACTION, } from '../constants/ActionTypes'

export function notoWriteAction(id, text) {
  return {
    type: NOTO_WRITE_ACTION,
    id: id,
    text: text
  }
}

export function notoRawAction(raw) {
  return {
    type: NOTO_RAW_ACTION,
    raw: raw
  }
}

export function notoCreateAction() {
  return {
    type: NOTO_CREATE_ACTION
  }
}

export function notoDeleteAction(id) {
  return {
    type: NOTO_DELETE_ACTION,
    id: id
  }
}

export function notoSelectAction(id) {
  return {
    type: NOTO_SELECT_ACTION,
    id: id
  }
}

export function notoBlocksAction(blocks) {
  return {
    type: NOTO_BLOCKS_ACTION,
    blocks: blocks
  }
}

