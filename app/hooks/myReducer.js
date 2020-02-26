import { mergeDeep } from '../utils'
import { useReducer } from 'react'

function reducer (state = {}, { type, payload }) {
  console.log(`>> ${type}`, payload)
  switch (type) {
    case 'set':
      return payload
    case 'push':
      return { ...state, [payload.key]: [...(state[payload.key] || []), payload.value] }
    case 'merge':
      return mergeDeep(state, payload)
    default:
      throw new Error()
  }
}

export default function useMyReducer () {
  const [state, dispatch] = useReducer(reducer)

  function set (payload) {
    dispatch({ type: 'set', payload })
  }
  function push (key, value) {
    dispatch({ type: 'push', payload: { key, value } })
  }
  function merge (payload) {
    dispatch({ type: 'merge', payload })
  }

  return [state, { merge, set, push }]
};
