


function handleSession(io, socket, session) {

  socket.on('newUser', (name) => {
    session.joinUser(socket.id, name)
    socket.emit('updateTimer', session.timer.getStatus())
    socket.emit('updateUsers', session.users)
    io.emit('updateUsers', session.users)
  })

  // // currently not implemented in frontend
  // socket.on('renameUser', (newName) => {
  //   session.renameUser(socket.id, newName)
  //   io.emit('updateUsers', session.users)
  // })

  socket.on('newMessage', (message) => {
    session.newMessage(socket.id, message)
    io.emit('updateMessages', session.messages)
  })

  socket.on('exitUser', () => {
    session.removeUser(socket.id)
    io.emit('updateUsers', session.users)
  })

  socket.on('disconnect', () => {
    session.removeUser(socket.id)
    io.emit('updateUsers', session.users)
  })

}

export { handleSession }

  