import { useEffect, useState, useRef } from "react"
import { useSocket } from '../context/SocketContext'

import finishMessages from "../assets/finishMessages.mjs"
import finishSoundUrl from '../assets/tada.mp3'


export default function Timer() {

    const socket = useSocket()
    const intervalRef = useRef(null)
    const [remaining, setRemaining] = useState(0)
    const [description, setDescription] = useState('----')
    const [isRunning, setIsRunning] = useState(false)
    const [mayNotify, setMayNotify] = useState(false)

    // init finishSound
    const finishSound = new Audio()
    finishSound.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"
    finishSound.autoplay = true
    

    useEffect(() => {
        if(socket) {
            socket.on('updateTimer', (status) => {
                setIsRunning(status.isRunning)
                setRemaining(status.remaining)
                setDescription(status.description)
                status.isRunning ? start() : stop()
            })

            socket.on('timerFinished', () => {
                finishSound.src = finishSoundUrl
                const messageIdx = Math.floor(Math.random() * finishMessages.length)
                if(mayNotify) {
                    new Notification(
                        `pomoco: ${finishMessages[messageIdx]}`, 
                        { tag: "pomoco timer" }
                    )
                }
            })
    
            return () => {
                socket.off('updateTimer')
            }
        }
    }, [socket])

    useEffect(() => {
        if('Notification' in window && Notification.permission === 'granted') {
            setMayNotify(true)
        }
    })

    function start() {
        if(intervalRef.current) return
        intervalRef.current = setInterval(() => {
            setRemaining(prevRemaining => {
                if(prevRemaining == 0) {
                    stop()
                    return prevRemaining
                }
                return prevRemaining - 1
            })
        }, 1000)
        setIsRunning(true)
    }

    function stop() {
        if(intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        setIsRunning(false)
    }

    function emitToggle() {
        if(socket) socket.emit('toggleTimer')
    }

    function emitSkip() {
        if(socket) socket.emit('skipTimer')
    }

    function formatTime(seconds) {
        const mm = Math.floor(seconds / 60).toString().padStart(2, '0')
        const ss = (seconds % 60).toString().padStart(2, '0')
        return(`${mm}:${ss}`)
    }
    
    function requestNotificationPermission() {
        finishSound.autoplay = true
        if(!('Notification' in window)) return
        if(Notification.permission === 'granted') {
            setMayNotify(true)
        } else {
            Notification.requestPermission(permission => {
                if(permission === 'granted') {
                    setMayNotify(true)
                }
            })
        }
    }

    return (
        <div id="timer">
            <div id="mode">{description}</div>
            <div id="remaining">{formatTime(remaining)}</div>
            <div id="controls">
                <span className="control" onClick={emitToggle}>
                    {isRunning ? 'stop' : 'start'}
                </span>
                &nbsp;
                <span className="control" onClick={emitSkip}>skip</span>
            </div>
            { mayNotify ?
                <div id="notifications">&nbsp;</div> :
                <div id="notifications" className="control" onClick={requestNotificationPermission}>enable<br/>notifications</div> 
            }

        </div>
    )
}