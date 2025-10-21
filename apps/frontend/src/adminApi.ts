export async function getAdminStats() {
  const res = await fetch('/api/admin/stats', { credentials: 'include' });
  if (!res.ok) return null;
  return res.json();
}
