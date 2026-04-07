import React, { useState } from 'react';

export default function AIChatbot(){
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  function send(){
    if(!input.trim()) return;
    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      const responses = [
        "That's an interesting point about smart city management.",
        "I can help with city planning and resource allocation.",
        "For traffic issues, consider implementing AI-driven signals.",
        "Environmental monitoring is key for sustainable cities.",
        "How can I assist you further?"
      ];
      const aiMsg = { text: responses[Math.floor(Math.random() * responses.length)], sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  }

  return (
    <div className="card">
      <h4>AI Smart City Assistant</h4>
      <div style={{height: 300, overflowY: 'auto', border: '1px solid #ccc', padding: 8, marginBottom: 8}}>
        {messages.map((m, i) => (
          <div key={i} style={{textAlign: m.sender === 'user' ? 'right' : 'left'}}>
            <div className={`small ${m.sender === 'user' ? 'message-user' : 'message-ai'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div style={{display: 'flex'}}>
        <input className="input" value={input} onChange={e=>setInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&send()} placeholder="Ask about smart city..." />
        <button className="button" onClick={send}>Send</button>
      </div>
    </div>
  );
}