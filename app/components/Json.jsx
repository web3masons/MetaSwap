const Json = ({ children }) => {
  return (
    <pre>{JSON.stringify(children, null, 2)}</pre>
  )
}

export default Json
