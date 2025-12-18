import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "/api"; // nginx proxy -> backend

function App() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("1");
  const [user, setUser] = useState(null);
  const [userErr, setUserErr] = useState("");

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentErr, setCommentErr] = useState("");

  async function loadUsers() {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    setUsers(await res.json());
  }

  async function loadComments() {
    const res = await fetch(`${API_BASE}/comments`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    setComments(await res.json());
  }

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([loadUsers(), loadComments()]);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  async function queryUser(e) {
    e.preventDefault();
    setUser(null);
    setUserErr("");

    const idNum = Number(userId);
    if (!Number.isInteger(idNum)) {
      setUserErr("Veuillez entrer un ID numérique (ex: 1, 2, 3).");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/${idNum}`);
      if (res.status === 404) {
        setUserErr("Utilisateur introuvable.");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setUser(await res.json());
    } catch (e2) {
      setUserErr(String(e2));
    }
  }

  async function postComment(e) {
    e.preventDefault();
    setCommentErr("");

    const content = newComment.trim();
    if (!content) {
      setCommentErr("Le commentaire ne peut pas être vide.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setNewComment("");
      await loadComments();
    } catch (e2) {
      setCommentErr(String(e2));
    }
  }

  return (
    <div className="App">
      <header className="App-header">

        <section style={{ marginBottom: "2rem", border: "2px solid #61dafb", padding: "1rem", borderRadius: "8px", maxWidth: 560, width: "100%" }}>
          <h3>Users (depuis la DB)</h3>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {users.map((u) => (
              <span key={u.id} style={{ border: "1px solid #444", borderRadius: 8, padding: "0.25rem 0.5rem" }}>
                {u.id}
              </span>
            ))}
            {users.length === 0 && <p style={{ opacity: 0.8 }}>Aucun user (seed pas encore exécuté).</p>}
          </div>

          <form onSubmit={queryUser} style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <input
              type="number"
              placeholder="Enter user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={{ padding: "0.4rem", width: 140 }}
            />
            <button type="submit">Query User</button>
          </form>

          {userErr && <p style={{ color: "#ff6b6b" }}>{userErr}</p>}

          {user && (
            <div style={{ marginTop: "1rem", textAlign: "left", width: "100%", background: "#111827", padding: "0.75rem", borderRadius: 10 }}>
              <div><strong>ID:</strong> {user.id}</div>
              <div><strong>Name:</strong> {user.name}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</div>
            </div>
          )}
        </section>

        <section style={{ border: "2px solid #ff4d4f", padding: "1rem", borderRadius: "8px", maxWidth: 800, width: "100%" }}>
          <h2>Comments</h2>

          <form onSubmit={postComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Enter your comment"
              rows={4}
              style={{ width: "100%", padding: "0.5rem" }}
            />
            <button type="submit" style={{ marginTop: "0.5rem" }}>Post Comment</button>
          </form>

          {commentErr && <p style={{ color: "#ff6b6b" }}>{commentErr}</p>}

          <div style={{ marginTop: "1.2rem", width: "100%" }}>
            {comments.length === 0 ? (
              <p style={{ opacity: 0.8 }}>No comments yet.</p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: "#1f2937",
                    marginBottom: "0.75rem",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    border: "1px solid #444",
                    textAlign: "left",
                    wordBreak: "break-word"
                  }}
                >
                  {/* React échappe automatiquement le HTML ici => protège contre XSS */}
                  <div style={{ whiteSpace: "pre-wrap" }}>{c.content}</div>
                  <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
                    #{c.id} • {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </header>
    </div>
  );
}

export default App;
