import { CaseComponentNoSSR } from './CaseComponentNoSSR';

export default function Home() {
  return (
    <div
      className="App showcaseContainer"
      style={{
        minHeight: '100vh',
        display: 'flex'
      }}
    >
      <CaseComponentNoSSR />
    </div>
  );
}
