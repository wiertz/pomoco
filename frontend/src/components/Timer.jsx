import { useEffect, useState, useRef } from "react"
import { useSocket } from '../context/SocketContext'

import finishMessages from "../assets/finishMessages.mjs"
import finishSoundUrl from '../assets/tada.mp3'


export default function Timer() {

    const socket = useSocket()
    const [remaining, setRemaining] = useState(0)
    const [description, setDescription] = useState('----')
    const [isRunning, setIsRunning] = useState(false)
    const [mayNotify, setMayNotify] = useState(false)
    const secondTicker = useRef(null)
    
    // init finishSound
    const finishSound = new Audio()
    finishSound.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"
    finishSound.autoplay = true
    

    useEffect(() => {
        secondTicker.current = new Worker(new URL('../workers/secondTicker.js', import.meta.url))
        secondTicker.current.onmessage = (_tick) => {
            console.log('tick')
            setRemaining(prevRemaining => {
                if(prevRemaining === 0) {
                    stop()
                    return prevRemaining
                }
                return prevRemaining - 1
            })
        }

        if('Notification' in window && Notification.permission === 'granted') {
            setMayNotify(true)
        }

        return () => {
            secondTicker.current.terminate()
        }
    }, [])

    
    useEffect(() => {
        if(socket) {
            socket.on('updateTimer', (status) => {
                setRemaining(status.remaining)
                setDescription(status.description)
                if(secondTicker.current) {
                    setIsRunning(status.isRunning)
                    secondTicker.current.postMessage(status.isRunning ? 'start' : 'stop')
                } else {
                    setIsRunning(false)
                }
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
                socket.off('timerFinished')
            }
        }
    }, [socket])
    

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