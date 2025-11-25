import classes from './FormSection.module.css';
import classNames from 'classnames';
import { exportDesigns, ProductColor, ProductConfig } from './ProductEditorUIConfig';
import { PRODUCT_SAMPLES } from './product';
import CreativeEditorSDK from '@cesdk/cesdk-js';

interface FormSectionProps {
  productId: string;
  setProductId: (productId: string) => void;
  product: ProductConfig;
  color: ProductColor;
  setColor: (color: ProductColor) => void;
  cesdk: CreativeEditorSDK | null;
}

function FormSection({
  productId,
  setProductId,
  product,
  color,
  setColor,
  cesdk
}: FormSectionProps) {
  async function onAssetsDownload() {
    if (!cesdk) {
      console.warn('Editor not initialized yet');
      return;
    }
    const { archive, pdfs, thumbnails } = await exportDesigns(cesdk, product);
    for (const [areaId, pdf] of Object.entries(pdfs)) {
      localDownload(pdf, `scene-${new Date().toISOString()}-${areaId}.pdf`);
    }
    for (const [areaId, thumbnail] of Object.entries(thumbnails)) {
      localDownload(
        thumbnail,
        `scene-thumbnail-${new Date().toISOString()}-${areaId}.png`
      );
    }
    localDownload(archive, `scene-${new Date().toISOString()}.zip`);
  }

  return (
    <div className={classes.formWrapper}>
      {/* Product Selection */}
      <div className={classes.subSection}>
        <div className={classes.subSectionTitle}>Product</div>
        <div className={classes.productGrid}>
          {PRODUCT_SAMPLES.map((p) => {
            const thumbnailPath = `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/product-editor-ui/${p.id}/thumbnail.png`;

            return (
              <button
                key={p.id}
                className={classNames(classes.productButton, {
                  [classes.productButtonActive]: productId === p.id
                })}
                onClick={() => setProductId(p.id)}
                title={p.label}
              >
                <img
                  src={thumbnailPath}
                  alt={p.label}
                  className={classes.productThumbnail}
                />
                <span className={classes.productLabel}>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Selection */}
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
                onClick={() => setColor(c)}
                className={classes.colorPickerButton}
                title={c.id}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Download Assets */}
      <div className={classes.subSection}>
        <p className={classNames(classes.centeredText, 'paragraphSmall--black')}>
          This is a demo. Download generated assets{' '}
          <button onClick={onAssetsDownload} className={classes.downloadLinkText}>
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
