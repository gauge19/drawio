document.addEventListener("DOMContentLoaded", function (event) {

    const socket = io();

    socket.on('connect', () => {
        console.log(`connected: ${socket.connected}, ${socket.nsp}, ${socket.id}`);
    });

    socket.on("pong", latency => console.log(`Latency: ${latency}`))
    socket.emit("ping")

    socket.on("message", data => {
        console.log(`message received: '${data}'`);
        socket.send(data)
    })

    socket.on('disconnect', () => {
        console.log(`connected: ${socket.connected}`);
    });

    // ---------------------------------------------------------------

    document.getElementById("testbtn").addEventListener("click", e => {
        socket.send("test")
    })

})
