import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import { ReactComponent as ArrowDownIcon } from '../../icons/ArrowDown.svg';
import { ReactComponent as ArrowUpIcon } from '../../icons/ArrowUp.svg';
import { ReactComponent as PlusIcon } from '../../icons/Plus.svg';
import { ReactComponent as TrashBinIcon } from '../../icons/TrashBin.svg';
import classNames from 'classnames';
import { useEngine } from '../../lib/EngineContext';
import { usePagePreview } from '../../lib/PagePreviewContext';
import { useSinglePageMode } from '../../lib/SinglePageModeContext';
import { caseAssetPath } from '../../util';
import classes from './BookPreviewBar.module.css';

const BookPreviewBar = () => {
  const { engine } = useEngine();
  const { sortedPageIds, currentPageBlockId, setEnabled } = useSinglePageMode();
  const { setCurrentPageBlockId, refocus } = useSinglePageMode();
  const { pagePreviews } = usePagePreview();

  const addPageFromTemplate = async () => {
    setEnabled(false);
    const pagesParent = engine.block.getParent(
      engine.block.findByType('page')[0]
    );
    const sceneString = await fetch(caseAssetPath('/template-0.scene')).then(
      (response) => response.text()
    );
    const blocks = await engine.block.loadFromString(sceneString);
    const page = blocks[0];
    engine.block.setVisible(page, false);
    engine.block.appendChild(pagesParent, page);
    await setCurrentPageBlockId(page);
    refocus();
    setEnabled(true);
  };
  const deletePage = async () => {
    setEnabled(false);
    const currentPageIndex = sortedPageIds.indexOf(currentPageBlockId);
    await setCurrentPageBlockId(
      sortedPageIds.filter((id) => id !== currentPageBlockId)[
        Math.max(currentPageIndex - 1, 0)
      ]
    );
    engine.block.destroy(currentPageBlockId);
    refocus();
    setEnabled(true);
  };
  const movePageUp = () => {
    setEnabled(false);
    const pageParent = engine.block.getParent(currentPageBlockId);
    const newIndex = Math.max(sortedPageIds.indexOf(currentPageBlockId) - 1, 0);
    engine.block.insertChild(pageParent, currentPageBlockId, newIndex);
    refocus();
    setEnabled(true);
  };
  const movePageDown = () => {
    setEnabled(false);
    const pageParent = engine.block.getParent(currentPageBlockId);
    const newIndex = Math.min(
      sortedPageIds.indexOf(currentPageBlockId) + 1,
      sortedPageIds?.length - 1
    );
    engine.block.insertChild(pageParent, currentPageBlockId, newIndex);
    refocus();
    setEnabled(true);
  };

  return (
    <div className={classes.wrapper}>
      <h3 className={classes.headline}>Pages</h3>
      <ul className={classes.pagePreviewList}>
        {sortedPageIds?.map((id, index) => (
          <li key={id}>
            <button
              className={classNames(classes.pagePreviewItem, {
                [classes['pagePreviewItem--active']]: id === currentPageBlockId,
                [classes['pagePreviewItem--loading']]:
                  pagePreviews[id]?.isLoading
              })}
              onClick={async () => {
                await setCurrentPageBlockId(id);
              }}
            >
              {pagePreviews[id] && pagePreviews[id].path && (
                <img
                  className={classes.pagePreviewImg}
                  src={pagePreviews[id]?.path}
                  alt={``}
                />
              )}
              {pagePreviews[id]?.isLoading && <LoadingSpinner />}
            </button>
          </li>
        ))}
        <li>
          <button className={classes.addButton} onClick={addPageFromTemplate}>
            <PlusIcon />
            <span>Add Page</span>
          </button>
        </li>
      </ul>
      <div className={classes.actions}>
        <div className={classes.orderButtons}>
          <button onClick={movePageUp}>
            <ArrowUpIcon />
          </button>
          <button onClick={movePageDown}>
            <ArrowDownIcon />
          </button>
        </div>
        <div>
          {sortedPageIds?.length > 1 && (
            <button onClick={deletePage}>
              <TrashBinIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookPreviewBar;
