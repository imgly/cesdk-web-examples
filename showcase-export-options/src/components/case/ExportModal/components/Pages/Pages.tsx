import classNames from 'classnames';
import React, { useCallback, useState } from 'react';

import { getPagesFromRange } from '../../lib/getPagesFromRange';
import { PageAmountType } from '../../types';
import { HelperText } from '../HelperText/HelperText';
import { Input } from '../Input/Input';
import { RadioGroup } from '../RadioGroup/RadioGroup';
import classes from './Pages.module.css';

const ExportPagesItems = [
  { label: 'Export all Pages', value: PageAmountType.ALL },
  { label: 'Export Range of Pages', value: PageAmountType.RANGE }
];

interface Props {
  setPageRange: (value: string) => void;
  className?: string;
}

export const Pages: React.FC<Props> = ({ setPageRange, className }) => {
  const [pageAmountType, setPageAmountType] = useState<PageAmountType>(
    PageAmountType.ALL
  );
  const [pageRangeError, setPageRangeError] = useState<string | null>(null);

  const handleSetRadioGroup = useCallback(
    (value: PageAmountType) => {
      if (
        value === PageAmountType.ALL &&
        pageAmountType === PageAmountType.RANGE
      ) {
        setPageRange('');
      }

      setPageAmountType(value);
    },
    [pageAmountType, setPageRange, setPageAmountType]
  );

  const handlePageRangeChange = useCallback(
    (value: string) => {
      try {
        getPagesFromRange([], value);
      } catch (error: any) {
        if (error?.message) {
          setPageRangeError(error.message);
        }
        return;
      }
      setPageRangeError(null);
      setPageRange(value);
    },
    [setPageRange]
  );

  return (
    <div className={classNames(classes.root, className)}>
      <RadioGroup<PageAmountType>
        name="Page-Amount-Radio-Group"
        value={pageAmountType}
        options={ExportPagesItems}
        onChange={handleSetRadioGroup}
      />
      {pageAmountType === PageAmountType.RANGE && (
        <>
          <Input
            error={!!pageRangeError}
            name="Page-Range"
            className={classes.input}
            placeholder="e.g.: 1,1-2"
            onChange={handlePageRangeChange}
          />
          {pageRangeError && (
            <HelperText error className={classes.input}>
              {pageRangeError}
            </HelperText>
          )}
          {!pageRangeError && (
            <HelperText className={classes.input}>
              Select Pages to Export.
            </HelperText>
          )}
        </>
      )}
    </div>
  );
};
