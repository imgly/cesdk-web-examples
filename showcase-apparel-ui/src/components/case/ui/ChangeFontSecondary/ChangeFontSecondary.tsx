import { useState } from 'react';
import { useEngine } from '../../lib/EngineContext';
import FontSelect from '../FontSelect/FontSelect';

const ChangeFontSecondary = () => {
  const { engine } = useEngine();
  const [activeTypeface, setActiveTypeface] = useState(
    engine.block.getTypeface(engine.block.findAllSelected()[0])
  );

  return (
    <FontSelect
      onSelect={(font, typeface) => {
        engine.block.findAllSelected().forEach((block) => {
          engine.block.setFont(block, font.uri, typeface);
        });
        setActiveTypeface(typeface);
      }}
      activeTypeface={activeTypeface}
    />
  );
};
export default ChangeFontSecondary;
