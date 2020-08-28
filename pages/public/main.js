console.log(`username: ${localStorage.getItem("username")}`);

document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("username__input").addEventListener("input", e => {
        localStorage.setItem("username", e.target.value)
        console.log("new username: ", localStorage.getItem("username"));
    })

    fetch("/api/uuid")
        .then(res => {
            if (res.ok) return res.text()
            else throw Error("error", res)
        })
        .then(data => {
            console.log(data);
            document.getElementById("newuuid").textContent = data
        })
        .catch(err => console.error(err))

    const socket = io('/4632746e-37dc-41ef-8c28-cafcf4913d69');

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
