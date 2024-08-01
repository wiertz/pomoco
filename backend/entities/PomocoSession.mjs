class PomocoSession {
    constructor(timer) {
        this.timer = timer
        this.users = {}
        this.messages = []
        this.messageCounter = 0
    }
    joinUser(id, name) {
        this.users[id] = name
    }
    removeUser(id) {
        delete this.users[id]
    }
    renameUser(id, newName) {
        this.users[id] = newName
    }
    newMessage(socketId, message) {

        // set message key
        this.messageCounter += 1

        // only store up to three messages
        this.messages.length == 3 && this.messages.shift()

        // create timestamp
        const currentDate = new Date()
        const hh = currentDate.getHours().toString().padStart(2, '0')
        const mm = currentDate.getMinutes().toString().padStart(2, '0')
        
        this.messages.push({
            key: this.messageCounter,
            name: this.users[socketId],
            time: `${hh}:${mm}`,
            message
        })
    }
}


export { PomocoSession }