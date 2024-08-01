import { useState, useEffect, useRef } from "react"


export default function EnterName({ onSetName: handleSetName }) {
  
    const inputRef = useRef(null)
    const [userName, setUserName] = useState('')

    const handleChange = (e) => {
        setUserName(e.target.value)
    }

    const handleKeyUp = (e) => {
        if(e.key === 'Enter' && userName) {
            e.preventDefault()
            handleSetName(userName)
        }
    }

    useEffect(() => {
        // check for name in local storage
        const storedName = localStorage.getItem('userName')
        if(storedName) setUserName(storedName)

        // focus input field
        inputRef.current.focus()
    }, [])

    return(
        <div id="enter-name">
            <input 
                ref={inputRef}
                type="text"
                id="input-name"
                onChange={handleChange}
                onKeyUp={handleKeyUp}
                value={userName}
            />
            <label htmlFor="enter-name">Enter your name to join</label>
        </div>
    )
}