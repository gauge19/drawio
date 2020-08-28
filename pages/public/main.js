function setRooms(rooms) {
    const container = document.getElementById("rooms-container")
    container.innerHTML = ""

    for (const roomid in rooms) {
        const room_elem = document.createElement("a")
        room_elem.textContent = `${roomid} - ${rooms[roomid].type} - ${rooms[roomid].users.length}`
        room_elem.setAttribute("href", `/room/${roomid}`)
        container.appendChild(room_elem)
    }
}

document.addEventListener("DOMContentLoaded", function (event) {

    const socket = io();

    socket.on('connect', () => {
        console.log(`connected: ${socket.connected}, ${socket.nsp}, ${socket.id}`);
    });

    socket.on("pong", latency => console.log(`Latency: ${latency}`))
    socket.emit("ping")

    socket.on("message", text => console.log(`message: '${text}'`))

    socket.on("rooms", data => {
        console.log("rooms", data);
        setRooms(data)
    })

    socket.on('disconnect', () => {
        console.log(`connected: ${socket.connected}`);
    });

    // ---------------------------------------------------------------

    document.getElementById("testbtn").addEventListener("click", e => {
        socket.send("test")
    })

    document.getElementById("button-public").addEventListener("click", e => {
        fetch("/api/uuid")
            .then(response => response.text())
            .then(uuid => {
                window.open(`/room/${uuid}?type=public`)
            })
            .catch(err => console.error(err.message))
    })

})
