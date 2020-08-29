function addMessage(text) {
    const container = document.getElementById("message-container")

    const message = document.createElement("div")
    message.textContent = text

    container.appendChild(message)
}


document.addEventListener("DOMContentLoaded", function (event) {
    const pathname = window.location.pathname.split('/')
    const roomid = pathname[pathname.length - 1]


    // ---------------------------------------------------------------  

    const socket = io();

    socket.on('connect', () => {
        console.log(`connected: ${socket.connected}, ${socket.nsp}, ${socket.id}`);

        const params = new URLSearchParams(window.location.search)

        // try to join a private room
        if (params.has("type") && params.get("type") == "private") {

            let password
            if (params.get("method") == "create") password = window.prompt("Set password:") // let user choose password
            else password = window.prompt("Enter password to join room:") // let user enter password

            // if no password was entered, create and join public room
            if (password == "") socket.emit("join", { id: roomid, type: "public" })
            else socket.emit("join", { id: roomid, type: "private", password })

        } else {
            console.log("public");
            socket.emit("join", { id: roomid, type: "public" })
        }

    });

    socket.on("wrong password", () => {
        console.log("wrong password");
        window.alert("Wrong password! Reload page to try again.")
    })

    socket.on("message", data => {
        console.log(`message received: '${data}'`);
        addMessage(data)
    })

    socket.on('disconnect', () => {
        console.log(`connected: ${socket.connected}`);
    });

    // ---------------------------------------------------------------

    document.getElementById("message-btn").addEventListener("click", e => {
        const input = document.getElementById("message-input")
        if (input.value !== "") socket.send(input.value)

        input.value = "" // clear input field
    })

    // Execute a function when the user releases a key on the keyboard
    document.getElementById("message-input").addEventListener("keyup", e => {
        // Number 13 is the "Enter" key on the keyboard
        if (e.keyCode === 13) {
            document.getElementById("message-btn").click();
        }
    });

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    ctx.fillStyle = "rgba(255, 0, 0, 1)"
    ctx.fillRect(10, 10, 55, 50);

    ctx.fillStyle = "rgba(0, 0, 255, 0.5)"
    ctx.fillRect(30, 30, 55, 50);

    ctx.beginPath();
    ctx.moveTo(75, 50);
    ctx.lineTo(100, 75);
    ctx.lineTo(100, 25);
    ctx.fill();
})