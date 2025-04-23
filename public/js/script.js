const socket = io();
const markers = {};
let myId = null;

const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
}).addTo(map);


socket.on("connect", () => {
    myId = socket.id;

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                socket.emit("send-location", { latitude, longitude });
            },
            (error) => {
                console.error("Geolocation error:", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 1000,
            }
        );
    }
});

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    if (id === myId) {
        map.setView([latitude, longitude], 16);
    }

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        const marker = L.marker([latitude, longitude]).addTo(map);
        marker.bindPopup(id === myId ? "You" : `User: ${id}`).openPopup();
        markers[id] = marker;
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
