import { useEffect, useState } from 'react';

const API = 'http://127.0.0.1:5000';

export default function APP() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  const load = () => fetch(`${API}/todos`).then(r => r.json()).then(setTodos);
  useEffect(() => { load(); }, []);

  const add = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    await fetch(`${API}/todos`, { method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({text}) });
    setText('');
    load();
  };

  const toggle =async id => { await fetch(`${API}/todos/${id}`, { method: 'PUT' }); load(); };
  const del = async id => { await fetch(`${API}/todos/${id}`, { method: 'DELETE' }); load(); };
  return (
    <div style={{ maxWidth: 520, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h2>Todos</h2>

      <form onSubmit={add} style={{ display: 'flex', gap: 8}}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="New todo..." style={{ flex: 1, padding: 8}} />
        <button>Add</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
        {todos.map(t => (
          <li key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid #eee'}}>
            <input type="checkbox" checked={t.completed} onChange={() => toggle(t.id)} />
            <span style={{ flex: 1, textDecoration: t.completed ? 'line-through' : 'none'}}>{t.text}</span>
            <button onClick={() =>del(t.id)} arial-label="Delete">X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}