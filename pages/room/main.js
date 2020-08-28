
console.log(`username: ${localStorage.getItem("username")}`);

document.addEventListener("DOMContentLoaded", function (event) {
    const pathname = window.location.pathname.split('/')
    const roomid = pathname[pathname.length - 1]

    document.getElementById("roomid").textContent = roomid

    const socket = io('/' + roomid);

    socket.on('connect', () => {
        console.log(`connected: ${socket.connected}, ${socket.nsp}, ${socket.id}`);
    });

    socket.on("message", data => {
        console.log(`message received: '${data}'`);
    })

    socket.on('disconnect', () => {
        console.log(`connected: ${socket.connected}`);
    });
})