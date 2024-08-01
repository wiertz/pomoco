
function handleTimerEvents(io, timer) {

  timer.events.on('finished', () => {
    io.emit('timerFinished')
    timer.nextPeriod()
    io.emit('updateTimer', timer.getStatus())
  })

  io.on('connection', (socket) => {
    socket.on('toggleTimer', () => {
      timer.isRunning() ? timer.stop() : timer.start()
      io.emit('updateTimer', timer.getStatus())
    })
  
    socket.on('skipTimer', () => {
      timer.nextPeriod()
      io.emit('updateTimer', timer.getStatus())
    })
  })



}

export { handleTimerEvents }
