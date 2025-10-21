
import React, { useEffect, useState } from 'react';
import { getUser, linkIDs, createTicket } from './api';
import { getAdminStats } from './adminApi';



export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [ids, setIds] = useState({ upgraderId: '', rustmagicId: '', kickId: '', otherId: '' });
  const [linkStatus, setLinkStatus] = useState('');
  const [ticket, setTicket] = useState({ category: '', priority: '', summary: '' });
  const [ticketStatus, setTicketStatus] = useState('');


  useEffect(() => {
    getUser().then(setUser);
    getAdminStats().then(setAdminStats);
  }, []);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkStatus('');
    const res = await linkIDs({ discordId: user?.discord?.id, ...ids });
    setLinkStatus(res.ok ? 'Linked successfully!' : res.error || 'Link failed');
  };

  const handleTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketStatus('');
    const res = await createTicket({ creatorId: user?.discord?.id, ...ticket });
    setTicketStatus(res.ok ? 'Ticket created!' : res.error || 'Ticket failed');
  };

  if (!user || !adminStats) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', color: '#FFD700' }}>
      <h2>Welcome, {user.discord?.username || user.kick?.username || 'User'}!</h2>
      <div style={{ margin: '24px 0' }}>
        <a href="/api/auth/discord"><button>Sign in with Discord</button></a>
        <a href="/api/auth/kick"><button>Sign in with Kick</button></a>
      </div>
      <form onSubmit={handleLink} style={{ marginBottom: 32 }}>
        <h3>Link Your IDs</h3>
        <input placeholder="Upgrader ID" value={ids.upgraderId} onChange={e => setIds({ ...ids, upgraderId: e.target.value })} />
        <input placeholder="RustMagic ID" value={ids.rustmagicId} onChange={e => setIds({ ...ids, rustmagicId: e.target.value })} />
        <input placeholder="Kick ID" value={ids.kickId} onChange={e => setIds({ ...ids, kickId: e.target.value })} />
        <input placeholder="Other ID" value={ids.otherId} onChange={e => setIds({ ...ids, otherId: e.target.value })} />
        <button type="submit">Link IDs</button>
        <div>{linkStatus}</div>
      </form>
      <form onSubmit={handleTicket} style={{ marginBottom: 32 }}>
        <h3>Create Ticket</h3>
        <input placeholder="Category" value={ticket.category} onChange={e => setTicket({ ...ticket, category: e.target.value })} />
        <input placeholder="Priority" value={ticket.priority} onChange={e => setTicket({ ...ticket, priority: e.target.value })} />
        <input placeholder="Summary" value={ticket.summary} onChange={e => setTicket({ ...ticket, summary: e.target.value })} />
        <button type="submit">Create Ticket</button>
        <div>{ticketStatus}</div>
      </form>
      {/* Admin Dashboard Section */}
      <div style={{ background: '#222', borderRadius: 12, padding: 24, marginTop: 32 }}>
        <h3>Admin Dashboard</h3>
        <div style={{ display: 'flex', gap: 32 }}>
          <div>
            <div>Open Tickets: <b>{adminStats.openTickets}</b></div>
            <div>Closed Tickets: <b>{adminStats.closedTickets}</b></div>
            <div>Average Rating: <b>{adminStats.avgRating.toFixed(2)}</b></div>
          </div>
          <div>
            <h4>Leaderboard</h4>
            <ol>
              {adminStats.leaderboard.map((admin: any, i: number) => (
                <li key={i}>
                  <b>{admin.adminId}</b> — XP: {admin.xpTotal}, Level: {admin.level || '?'}
                  {adminStats.badges.filter((b: any) => b.adminId === admin.adminId).length > 0 && (
                    <span> | Badges: {adminStats.badges.filter((b: any) => b.adminId === admin.adminId).map((b: any) => b.badgeKey).join(', ')}</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
