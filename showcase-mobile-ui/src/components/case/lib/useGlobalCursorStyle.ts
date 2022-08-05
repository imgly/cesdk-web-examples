import { RefObject, useEffect, useMemo } from 'react';
import ResizeCursor from '../components/ResizeCursor/ResizeCursor';
import { useEditor } from '../EditorContext';

export const RotationCursor =
  'url("data:image/svg+xml,%3Csvg width=%2722%27 height=%2725%27 viewBox=%270 0 22 25%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg filter=%27url(%23filter0_d)%27%3E%3Cpath d=%27M18 11.1071C18 14.5637 15.5566 17.4515 12.3314 18.0846V20L7.20308 17.0145L12.3314 14.0289V15.7825C14.3292 15.1951 15.7946 13.3221 15.7946 11.107C15.7946 8.42285 13.6437 6.23908 11 6.23908C8.35629 6.23908 6.20542 8.42285 6.20542 11.107C6.20542 11.8299 6.35745 12.5252 6.65738 13.1736L4.66118 14.1255C4.22245 13.1771 4 12.1616 4 11.1071C4.00007 7.18825 7.1403 4 11.0001 4C14.8599 4 18 7.18825 18 11.1071Z%27 fill=%27black%27/%3E%3Cpath d=%27M12.8314 15.0559V14.0289V13.1593L12.0799 13.5968L6.95152 16.5824L6.20927 17.0145L6.95152 17.4466L12.0799 20.4321L12.8314 20.8696V20V18.4841C16.0889 17.6521 18.5 14.6573 18.5 11.1071C18.5 6.9193 15.1431 3.5 11.0001 3.5C6.85702 3.5 3.50008 6.91929 3.5 11.1071V11.1071C3.5 12.2334 3.73793 13.3206 4.20739 14.3354L4.41978 14.7946L4.8764 14.5768L6.8726 13.6249L7.31866 13.4122L7.11118 12.9637C6.84206 12.3819 6.70542 11.7584 6.70542 11.107C6.70542 8.69181 8.63956 6.73908 11 6.73908C13.3604 6.73908 15.2946 8.69181 15.2946 11.107C15.2946 12.8513 14.2837 14.3564 12.8314 15.0559Z%27 stroke=%27white%27/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id=%27filter0_d%27 x=%270.0599999%27 y=%270.0599999%27 width=%2721.88%27 height=%2724.6193%27 filterUnits=%27userSpaceOnUse%27 color-interpolation-filters=%27sRGB%27%3E%3CfeFlood flood-opacity=%270%27 result=%27BackgroundImageFix%27/%3E%3CfeColorMatrix in=%27SourceAlpha%27 type=%27matrix%27 values=%270 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0%27/%3E%3CfeOffset/%3E%3CfeGaussianBlur stdDeviation=%271.47%27/%3E%3CfeColorMatrix type=%27matrix%27 values=%270 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0%27/%3E%3CfeBlend mode=%27normal%27 in2=%27BackgroundImageFix%27 result=%27effect1_dropShadow%27/%3E%3CfeBlend mode=%27normal%27 in=%27SourceGraphic%27 in2=%27effect1_dropShadow%27 result=%27shape%27/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E") 12 12, pointer';

export const CursorStyle = ({
  wrapperRef
}: {
  wrapperRef: RefObject<HTMLDivElement>;
}) => {
  useGlobalCursorStyle({ wrapperRef });

  return null;
};

export default function useGlobalCursorStyle({
  wrapperRef
}: {
  wrapperRef: RefObject<HTMLDivElement>;
}) {
  const { editorState } = useEditor();

  const cursor = useMemo(() => {
    if (!editorState) {
      return 'default';
    }
    switch (editorState.cursorType) {
      case 'Arrow':
        return 'default';
      case 'Move':
        return 'move';
      case 'Resize':
        return ResizeCursor({
          rotation: (editorState.cursorRotation * 180) / Math.PI + 45
        });
      case 'Rotate':
        return RotationCursor;
      case 'MoveNotPermitted':
        return 'auto'; // NOTE: temporarily solution. show regular cursor until engine differentiates between (immovable) page and (immovable) design elements.
      case 'Text':
        return 'text';
      default:
        return 'auto';
    }
  }, [editorState]);

  useEffect(() => {
    const currentWrapper = wrapperRef?.current;
    if (currentWrapper) {
      currentWrapper.style.cursor = cursor;
    }
    return () => {
      if (currentWrapper) {
        currentWrapper.style.removeProperty('cursor');
      }
    };
  }, [cursor, wrapperRef]);
}
