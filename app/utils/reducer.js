import { mergeDeep } from './misc'
import { useReducer } from 'react'

function reducer (state = {}, { type, payload }) {
  console.log(`>> ${type}`, payload)
  switch (type) {
    case 'set':
      return payload
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
  function merge (payload) {
    dispatch({ type: 'merge', payload })
  }

  return [state, { merge, set }]
};
