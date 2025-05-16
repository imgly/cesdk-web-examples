import classes from './FormSection.module.css';
import SegmentedControl from '@/components/ui/SegmentedControl/SegmentedControl';
import { useMemo, useState } from 'react';
import classNames from 'classnames';
import {
  exportDesigns,
  ProductColor
} from './ApparelEditorUIConfig';
import { PRODUCT_SAMPLES } from './product';
import CreativeEditorSDK from '@cesdk/cesdk-js';

interface FormSectionProps {
  areaId: string;
  setAreaId: (areaId: string) => void;
  color: ProductColor;
  setColor: (color: ProductColor) => void;
  cesdk: CreativeEditorSDK;
}

function FormSection({
  areaId,
  setAreaId,
  color,
  setColor,
  cesdk
}: FormSectionProps) {
  const product = PRODUCT_SAMPLES[0];
  const [quantity, setQuantity] = useState<number[]>(
    product.sizes.map((size) => (['M', 'L'].includes(size.id) ? 1 : 0))
  );
  const price = useMemo(
    () => (product.unitPrice * quantity.reduce((a, b) => a + b, 0)).toFixed(2),
    [quantity]
  );
  const previewUrl = useMemo(() => {
    const imageSource = product.areas.find(({ id }) => id === areaId)
      ?.mockup?.images;
    if (imageSource && imageSource.length > 0) {
      const newImageUrl = imageSource[0].uri.replace('{{color}}', color.id);
      return newImageUrl;
    }
  }, [areaId, color]);

  async function onAssetsDownload() {
    const { archive, pdfs, thumbnails, previews } = await exportDesigns(cesdk);
    for (const [areaId, pdf] of Object.entries(pdfs)) {
      localDownload(pdf, `scene-${new Date().toISOString()}-${areaId}.pdf`);
    }
    for (const [areaId, thumbnail] of Object.entries(thumbnails)) {
      localDownload(thumbnail, `scene-thumbnail-${new Date().toISOString()}-${areaId}.png`);
    }
    for (const [areaId, preview] of Object.entries(previews)) {
      localDownload(preview, `scene-preview-${new Date().toISOString()}-${areaId}.png`);
    }
    localDownload(archive, `scene-${new Date().toISOString()}.zip`);
  }

  return (
    <div className={classes.formWrapper}>
      <div className={classes.header}>
        <div>
          <p className="paragraph">Apparell Essentials</p>
          <h3 className="h3">Mens T-Shirt</h3>
        </div>
        <div className={classes.price}>
          <h5 className="h5">From 19,99 €</h5>
          <p className="paragraphSmall--black">+ Additional Fees</p>
        </div>
      </div>
      <div className={classes.subSection}>
        <div className={classes.subSectionTitle}>Decorations</div>
        <SegmentedControl
          options={product.areas.map(({ id, label, disabled }) => ({
            value: id,
            label: label,
            disabled: disabled
          }))}
          value={areaId}
          name="area"
          onChange={async (value) => {
            setAreaId(value);
          }}
          size="sm"
          buttonStyle={{ width: '100%' }}
        />
        <div className={classes.printDetails}>
          <img
            src={previewUrl}
            alt="Search Placeholder"
            className={classes.previewImage}
          />
          <div className={classes.printDetailsText}>
            <div>
              <p className={classNames(classes.bold, 'paragraphSmall--black')}>
                Print Area
              </p>
              <p className="paragraphSmall--black ">Width 249mm</p>
              <p className="paragraphSmall--black ">Height 265mm</p>
            </div>
            <div>
              <p className={classNames(classes.bold, 'paragraphSmall--black')}>
                Print Method
              </p>
              <p className="paragraphSmall--black ">Digital Printing</p>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.subSection}>
        <div className={classes.subSectionTitle}>Color</div>
        <div className={classes.colorPicker}>
          {product.colors.map((c) => (
            <div
              key={c.id}
              className={classNames(classes.colorPickerButtonWrapper, {
                [classes.active]: color.id === c.id
              })}
            >
              <button
                style={{ backgroundColor: c.colorHex }}
                onClick={() => {
                  setColor(c);
                }}
                className={classes.colorPickerButton}
              ></button>
            </div>
          ))}
        </div>
      </div>
      <div className={classes.subSection}>
        <div className={classes.subSectionTitle}>Size & Quantity</div>
        <div className={classes.sizeQuantityInputs}>
          {product.sizes.map((size, i) => (
            <div key={size.id} className={classes.sizeQuantityInputWrapper}>
              <p className="paragraphSmall--black">{size.id}</p>
              <input
                type="number"
                min={0}
                defaultValue={quantity[i]}
                className={classes.sizeQuantityInput}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value && parseInt(value) < 0) {
                    e.target.value = '0';
                    value = '0';
                  }
                  // If the value is empty, set it to 0 to avoid NaN error
                  if (!value) {
                    value = '0';
                  }
                  setQuantity((prev) => {
                    const newQuantity = [...prev];
                    newQuantity[
                      product.sizes.findIndex((s) => s.id === size.id)
                    ] = parseInt(value);
                    return newQuantity;
                  });
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={classes.subSection}>
        <button
          className={classNames(
            classes.addToCartButton,
            'button button--small'
          )}
          disabled={parseFloat(price) < 0}
        >
          {parseFloat(price) >= 0 ? price : ''} € • Add to Cart
        </button>
      </div>
      <div className={classes.subSection}>
        <p
          className={classNames(classes.centeredText, 'paragraphSmall--black')}
        >
          This is just a demo, but you can download the generated example assets{' '}
          <button
            onClick={onAssetsDownload}
            className={classes.downloadLinkText}
          >
            here
          </button>
          .
        </p>
      </div>
    </div>
  );
}

function localDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

export default FormSection;
