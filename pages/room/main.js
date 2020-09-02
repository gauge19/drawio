function addMessage(message, self) {
    const container = document.getElementById("message-container")

    // message row element
    const row = document.createElement("div")
    row.classList.add("message-row", self == message.origin ? "self" : "other")

    const msgContainer = document.createElement("div")
    msgContainer.classList.add("message-container")

    // message sender element
    const sender = document.createElement("div")
    sender.classList.add("message-sender")
    sender.textContent = message.origin == self ? "You" : message.origin// set sender 

    // message text element
    const text = document.createElement("div")
    text.classList.add("message-text")
    text.textContent = message.text // set msg text

    // message time element
    const time = document.createElement("div")
    time.classList.add("message-time")
    const d = new Date(message.time)
    time.textContent = `${d.getHours()}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()}`
    //time.textContent = "08:23"

    // add elements to DOM
    msgContainer.appendChild(sender)
    msgContainer.appendChild(text)
    msgContainer.appendChild(time)

    row.appendChild(msgContainer)

    container.appendChild(row)
}

const users = []

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
        addMessage(data, socket.id)
    })

    socket.on("draw", coords => {
        //drawCircle(ctx, coords.x, coords.y, 7, { color: "red" })
    })

    socket.on("mousedown", coords => {
        if (users[coords.origin]) {
            users[coords.origin].isDrawing = true
            users[coords.origin].x = coords.x
            users[coords.origin].y = coords.y
        } else {
            // add user if it doesnt exist yet
            users[coords.origin] = {
                isDrawing: true,
                x: coords.x,
                y: coords.y,
                color: "black"
            }
        }
    })

    socket.on("mousemove", coords => {
        if (users[coords.origin].isDrawing === true) {
            drawLine(ctx, users[coords.origin].x, users[coords.origin].y, coords.x, coords.y, { color: coords.color });
            users[coords.origin].x = coords.x;
            users[coords.origin].y = coords.y;
            users[coords.origin].color = coords.color;
        }
    })

    socket.on("mouseup", coords => {
        //console.log("mouseup", coords, users);
        if (users[coords.origin].isDrawing === true) {
            drawLine(ctx, users[coords.origin].x, users[coords.origin].y, coords.x, coords.y, { color: coords.color });

            // reset values
            users[coords.origin].x = 0;
            users[coords.origin].y = 0;
            users[coords.origin].isDrawing = false;
            users[coords.origin].color = coords.color;
        }
    })

    socket.on("clear", data => ctx.clearRect(0, 0, canvas.width, canvas.height))

    socket.on('disconnect', () => {
        console.log(`connected: ${socket.connected}`);
    });

    // ---------------------------------------------------------------

    document.getElementById("message-btn").addEventListener("click", e => {
        const input = document.getElementById("message-input")
        if (input.value !== "") socket.send({
            text: input.value,
            origin: socket.id,
            time: Date.now()
        })

        input.value = "" // clear input field
    })

    // Execute a function when the user releases a key on the keyboard
    document.getElementById("message-input").addEventListener("keyup", e => {
        // Number 13 is the "Enter" key on the keyboard
        if (e.keyCode === 13) {
            document.getElementById("message-btn").click();
        }
    });

    const canvas = document.getElementById("main-canvas")
    const ctx = canvas.getContext("2d")

    let color = "black"
    let isDrawing = false
    let x = 0
    let y = 0

    // event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

    // Add the event listeners for mousedown, mousemove, and mouseup
    canvas.addEventListener('mousedown', e => {
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;

        socket.emit("mousedown", { x, y, origin: socket.id })
    });

    canvas.addEventListener('mousemove', e => {
        if (isDrawing === true) {
            drawLine(ctx, x, y, e.offsetX, e.offsetY, { color });
            x = e.offsetX;
            y = e.offsetY;

            socket.emit("mousemove", { x, y, color, origin: socket.id })
        }
    });

    window.addEventListener('mouseup', e => {
        if (isDrawing === true) {
            drawLine(ctx, x, y, e.offsetX, e.offsetY, { color });
            socket.emit("mouseup", { x: e.offsetX, y: e.offsetY, color, origin: socket.id })

            x = 0;
            y = 0;
            isDrawing = false;
        }
    });

    for (const elem of document.getElementsByClassName("color-btn")) {
        elem.addEventListener("click", e => {
            color = e.target.dataset.color
        })
    }

    document.getElementById("clear-btn").addEventListener("click", e => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit("clear", { origin: socket.id })
    })

})

function drawLine(context, x1, y1, x2, y2, options = {}) {
    context.beginPath();
    context.strokeStyle = options.color || 'black';
    context.lineWidth = options.lineWidth || 2;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}

function drawCircle(context, x, y, radius, options = {}) {
    context.beginPath();
    context.fillStyle = options.color || 'black';
    //context.lineWidth = options.lineWidth || 2;
    context.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
    context.fill();
}