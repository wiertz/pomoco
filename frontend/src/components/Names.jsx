import { useState, useEffect } from "react"
import { useSocket } from '../context/SocketContext'


export default function Names() {

  const socket = useSocket()
  const [namesList, setNamesList] = useState([])

  useEffect(() => {
    if(socket) {
      socket.on('updateUsers', users => {
        setNamesList(
          Object.entries(users).map(([ id, name ]) => {
            return <p key={id}>{name}</p>
          })
        )
      })

      return () => {
        socket.off('updateUsers')
      }
    }
  }, [socket])


  return (
    <div id="names">
      {namesList}
    </div>
  )
}
