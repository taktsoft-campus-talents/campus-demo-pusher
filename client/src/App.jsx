import { useState, useEffect } from "react";
import "./App.css";
import Pusher from "pusher-js";

console.log(import.meta.env);
const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
});

function App() {
  // [{timestamp: "2024-11-15 ...", title:"Trump Präsident!", text:"sdkjhfskduf"}]
  const [news, setNews] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const channel = pusher.subscribe("news");
    channel.bind("new-news", (data) => {
      setNews((prev) => [data, ...prev]);
      console.log(data);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await fetch("http://localhost:3000/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Message from " + username,
          text: message,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <h1>Pusher Demo</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button>Submit</button>
      </form>
      <ul>
        {news.map((newsItem) => {
          return (
            <li key={newsItem.timestamp}>
              <h2>{newsItem.title}</h2>
              <p>{newsItem.text}</p>
              <p>{newsItem.timestamp}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default App;
