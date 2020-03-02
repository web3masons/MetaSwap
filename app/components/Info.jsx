import Spinner from './Spinner'
import { useEffect, useState } from 'react'

const strings = [
  'Just a moment',
  'Hold tight',
  'Two ticks',
  'Wait a second',
  'Processing',
  'Doing some stuff',
  'Be patient',
  'Things are happening',
  'Hol\' up',
  'Chill for a second',
  'Go grab a coffee',
  'Take a break'
]

const Info = ({ text }) => {
  const [string, setString] = useState()
  useEffect(() => {
    const string = strings[Math.floor(Math.random() * strings.length + 1)]
    setString(string)
  }, [])

  return (
    <div className="text-center text-primary">
      <h5>{string}...</h5>
      <Spinner />
      <h5>{text}</h5>
    </div>
  )
}

export default Info
