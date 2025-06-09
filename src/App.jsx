import React, { useState } from "react";
import "./App.css";

function App() {
  const [sleepTime, setSleepTime] = useState({ hour: "", minute: "", ampm: "PM" });
  const [wakeTime, setWakeTime] = useState({ hour: "", minute: "", ampm: "AM" });
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sleepTime.hour || !sleepTime.minute || !wakeTime.hour || !wakeTime.minute) {
      setResponse("Please fill all fields.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:4000/api/sleep-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sleepTime, wakeTime }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.message);
      } else {
        setResponse(data.error || "Something went wrong.");
      }
    } catch (error) {
      setResponse("Error connecting to server.");
    }

    setLoading(false);
  };

  const hourOptions = [...Array(12).keys()].map(i => i + 1);
  const minuteOptions = [...Array(60).keys()];

  return (
    <div className="app-container">
      <h1>Sleep-O-Meter</h1>
      <form onSubmit={handleSubmit} className="sleep-form">
        <div className="input-group">
          <label>Sleep Time:</label>
          <select name="hour" value={sleepTime.hour} onChange={handleInputChange(setSleepTime)} required>
            <option value="">HH</option>
            {hourOptions.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          :
          <select name="minute" value={sleepTime.minute} onChange={handleInputChange(setSleepTime)} required>
            <option value="">MM</option>
            {minuteOptions.map(m => (
              <option key={m} value={m < 10 ? `0${m}` : m}>{m < 10 ? `0${m}` : m}</option>
            ))}
          </select>
          <select name="ampm" value={sleepTime.ampm} onChange={handleInputChange(setSleepTime)}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>

        <div className="input-group">
          <label>Wake Time:</label>
          <select name="hour" value={wakeTime.hour} onChange={handleInputChange(setWakeTime)} required>
            <option value="">HH</option>
            {hourOptions.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          :
          <select name="minute" value={wakeTime.minute} onChange={handleInputChange(setWakeTime)} required>
            <option value="">MM</option>
            {minuteOptions.map(m => (
              <option key={m} value={m < 10 ? `0${m}` : m}>{m < 10 ? `0${m}` : m}</option>
            ))}
          </select>
          <select name="ampm" value={wakeTime.ampm} onChange={handleInputChange(setWakeTime)}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Checking..." : "Check Sleep-O-Meter"}
        </button>
      </form>

      <div className="response-box">
        {response && <p>{response}</p>}
      </div>
    </div>
  );
}

export default App;
