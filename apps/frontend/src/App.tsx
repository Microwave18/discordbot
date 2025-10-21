import React from 'react';
import mascot from '../../assets/mascot.png';

export default function App() {
  return (
    <div style={{ background: '#2B2B2B', minHeight: '100vh', color: '#FFD700', fontFamily: 'Rajdhani, sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 24 }}>
        <img src={mascot} alt="Mascot" width={64} height={64} style={{ borderRadius: 16, background: '#222' }} />
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', color: '#FF4500', fontWeight: 700 }}>DiscordBoto Dashboard</h1>
      </header>
      <main style={{ padding: 32 }}>
        <h2>Welcome!</h2>
        <p>This is the web dashboard for the DiscordBoto system. More features coming soon.</p>
      </main>
    </div>
  );
}
