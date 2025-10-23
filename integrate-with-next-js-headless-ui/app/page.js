// other imports...
import { default as CustomEditor } from './components/CustomEditorNoSSR';

export default function Home() {
  return (
    <div>
      <main>
        {/* other components.. */}
        <CustomEditor />
        {/* other components.. */}
      </main>
    </div>
  );
}
