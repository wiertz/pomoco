
function handleTimer(io, socket, pomocoSession) {

  const timer = pomocoSession.timer

  socket.on('toggleTimer', () => {
    timer.isRunning() ? timer.stop() : timer.start()
    io.emit('updateTimer', timer.getStatus())
  })

  socket.on('skipTimer', () => {
    timer.nextPeriod()
    io.emit('updateTimer', timer.getStatus())
  })

  timer.events.on('finished', () => {
    io.emit('timerFinished')
    timer.nextPeriod()
    io.emit('updateTimer', timer.getStatus())
  })

}

export { handleTimer }
