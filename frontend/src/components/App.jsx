import { useState } from 'react'
import { useSocket } from '../context/SocketContext'

import Names from './Names'
import Timer from './Timer'
import Chat from './Chat'
import EnterName from './EnterName'


export default function App() {

  const socket = useSocket()
  const [userName, setUserName] = useState('')

  const handleSetName = (userName) => {
    if(socket) {
      setUserName(userName)
      localStorage.setItem('userName', userName)
      socket.emit('newUser', userName)
    } else {
      // todo: show connection error
    }
  }

  return (
    <>
      { !userName && <EnterName onSetName={handleSetName} /> }
      <Names />
      <Timer />
      <Chat />
    </>
  )
}
