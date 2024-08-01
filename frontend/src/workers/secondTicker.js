
let interval = null


self.onmessage = function(event) {
    clearInterval(interval)
    interval = null

    if(event.data === 'start') {
        interval = setInterval(() => {
            postMessage('tick')
        }, 1000)
    }
}