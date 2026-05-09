export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <div style={{ fontSize: '2rem', fontWeight: 600 }}>
        404 — Page not found
      </div>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}
