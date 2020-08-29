function getLockImage(locked = false) {
    const img = document.createElement("img")
    img.setAttribute("src", locked ? "/icons/lock-closed.svg" : "/icons/lock-open.svg")
    img.classList.add("lock-img")

    return img
}

function setRooms(rooms) {
    const container = document.getElementById("rooms-container")
    container.innerHTML = ""

    for (const roomid in rooms) {
        const room_elem = document.createElement("div")

        room_elem.classList.add("room")
        if (rooms[roomid].type == "private") room_elem.classList.add("private")
        room_elem.textContent = `Users online: ${rooms[roomid].users.length}`
        room_elem.addEventListener("click", e => {
            window.open(`/room/${roomid}?method=join&type=${rooms[roomid].type == "private" ? "private" : "public"}`)
        })

        room_elem.appendChild(getLockImage(rooms[roomid].type == "private"))

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

    document.getElementById("button-public").addEventListener("click", e => {
        fetch("/api/uuid")
            .then(response => response.text())
            .then(uuid => {
                window.open(`/room/${uuid}?type=public&method=create`)
            })
            .catch(err => console.error(err.message))
    })

    document.getElementById("button-private").addEventListener("click", e => {
        fetch("/api/uuid")
            .then(response => response.text())
            .then(uuid => {
                window.open(`/room/${uuid}?type=private&method=create`)
            })
            .catch(err => console.error(err.message))
    })

})
