#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>  // Make sure to install this library!

// 1. Network Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// 2. Create Web Server on Port 5000 (Matching your Flask port)
WebServer server(5000);

// 3. Store your HTML file here
// (Copy the contents of your 'index.html' inside the R"rawliteral(...)rawliteral" block)
const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
    <title>ESP32 Control</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style> body { font-family: Arial; text-align: center; margin-top: 50px; } </style>
</head>
<body>
    <h1>ESP32 Vending Machine</h1>
    <button onclick="sendOrder()">Send Test Order</button>
    <p id="response"></p>

    <script>
        function sendOrder() {
            // This mimics the JSON your frontend sends
            const data = { item1: 1, item2: 0, item3: 2 };
            
            fetch('/x', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById("response").innerText = "Status: " + data.status + " | Ans: " + data.ans;
            });
        }
    </script>
</body>
</html>
)rawliteral";

// --- Route Handlers ---

// Replaces @app.route("/")
void handleRoot() {
    server.send(200, "text/html", index_html);
}

// Replaces @app.route("/x", methods=["POST"])
void handleX() {
    if (server.hasArg("plain") == false) {
        server.send(400, "text/plain", "Body not received");
        return;
    }

    String body = server.arg("plain");
    
    // Parse JSON using ArduinoJson
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, body);

    if (error) {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        server.send(400, "text/plain", "Invalid JSON");
        return;
    }

    // Logic from your Python script:
    // Extract quantities (default to 0 if missing)
    int q1 = doc["item1"] | 0; // Cold Drink (A)
    int q2 = doc["item2"] | 0; // Chocolate Bar (B)
    int q3 = doc["item3"] | 0; // Chips (C)

    // Build the string "A:1_B:2_C:0"
    String ans = "A:" + String(q1) + "_B:" + String(q2) + "_C:" + String(q3);

    // LOGIC: Instead of saving to a variable for later polling, ACT NOW.
    Serial.print("✅ Rotation command string: ");
    Serial.println(ans);
    
    // Call your hardware motor function here directly!
    // executeRotation(ans); 

    // Send response back to browser
    String jsonResponse = "{\"status\": \"received\", \"ans\": \"" + ans + "\"}";
    server.send(200, "application/json", jsonResponse);
}

// Replaces @app.route("/rotate/<int:n>")
// Accessed via http://ESP_IP:5000/rotate?n=5
void handleRotateManual() {
    if (server.hasArg("n")) {
        String n = server.arg("n");
        Serial.print("Manual Rotate: ");
        Serial.println(n);
        server.send(200, "text/plain", "okay");
    } else {
        server.send(400, "text/plain", "Missing 'n' parameter");
    }
}

void setup() {
    Serial.begin(115200);

    // Connect to Wi-Fi
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.print("Connected! IP Address: ");
    Serial.println(WiFi.localIP());

    // Define Routes
    server.on("/", handleRoot);
    server.on("/x", HTTP_POST, handleX);
    server.on("/rotate", handleRotateManual);

    server.begin();
    Serial.println("HTTP server started");
}

void loop() {
    server.handleClient(); // Listen for incoming client requests
}