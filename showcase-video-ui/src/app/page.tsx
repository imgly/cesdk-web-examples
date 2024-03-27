import dynamic from 'next/dynamic';

const DynamicCaseComponent = dynamic(
  () => import('../components/case/CaseComponent'),
  {
    ssr: false
  }
);

export default function Home() {
  return (
    <div
      className="App"
      style={{
        minHeight: '100vh',
        display: 'flex'
      }}
    >
      <DynamicCaseComponent />
    </div>
  );
}
