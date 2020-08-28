
document.addEventListener("DOMContentLoaded", function (event) {
    const pathname = window.location.pathname.split('/')
    const roomid = pathname[pathname.length - 1]

    document.getElementById("roomid").textContent = roomid

    const socket = io();

    socket.on('connect', () => {
        console.log(`connected: ${socket.connected}, ${socket.nsp}, ${socket.id}`);
        socket.emit("join", { id: roomid, type: "public" })
    });

    socket.on("message", data => {
        console.log(`message received: '${data}'`);
        const li = document.createElement("li")
        li.textContent = data
        document.getElementById("messages").appendChild(li)
    })

    socket.on('disconnect', () => {
        console.log(`connected: ${socket.connected}`);
    });

    // ---------------------------------------------------------------

    document.getElementById("testbtn").addEventListener("click", e => {
        socket.send("test")
    })
})