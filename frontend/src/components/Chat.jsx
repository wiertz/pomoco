import { useEffect, useState } from "react"
import { useSocket } from '../context/SocketContext'


export default function Chat() {

    const socket = useSocket()
    const [newMessage, setNewMessage] = useState('')
    const [chatLines, setChatLines] = useState([])

    const handleKeyUp = (e) => {
        if(e.key === 'Enter' && newMessage) {
            e.preventDefault()
            socket.emit('newMessage', newMessage)
            setNewMessage('')
        }
    }

    const handleChange = (e) => {
        setNewMessage(e.target.value)
    }


    useEffect(() => {
        if(socket) {
            socket.on('updateMessages', messages => {
                setChatLines(messages.map(m => {
                    return <p key={m.key}>{`${m.name} (${m.time}): ${m.message}`}</p>
                }))
            })
        }
    }, [socket])


    return (
        <>
            <div id="messages">
                {chatLines}
            </div>
            <input 
                type='text'
                value={newMessage}
                onChange={handleChange}
                onKeyUp={handleKeyUp}
                placeholder="Write a message..." 
            />
        </>
    )
}