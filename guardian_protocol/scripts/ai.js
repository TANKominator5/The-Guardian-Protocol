const data = {
    "duration-min": 0,
    "previous-misconduct-count": 0,
    "hour": 0,
    "source-Swipe": 0,
    "source-WiFi": 0,
    "location-Hostel": 0,
    "location-Lab-1": 0,
    "location-Lab-2": 0,
    "location-Library": 0,
    "location-Main-Gate": 0,
    "location-Sports-Ground": 0,
    "action-Entry": 0,
    "action-Exit": 0,
    "action-Sighted": 0
};

fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("✅ Response from FastAPI:", result);
    })
    .catch(error => {
        console.error("❌ Request failed:", error);
    });
