import { ColorPicker } from '@/components/ui/ColorPicker/ColorPicker';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import SegmentedControl from '@/components/ui/SegmentedControl/SegmentedControl';
import CreativeEngine, {
  Configuration,
  RGBColor,
  supportsVideoExport
} from '@cesdk/engine';
import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SIZES } from '../CaseComponent';
import { hexToRgba } from '../convert';
import WarningIcon from '../icons/AlertTriangle.svg';
import { caseAssetPath } from '../util';
import classes from './CustomizationSection.module.css';
import { GeneratedAsset } from './GeneratedAssetsSection';
import { Podcast } from './PodcastSearchSection';

interface CustomizationSectionProps {
  podcastProp: Podcast;
  onAssetsUpdate: (assets: GeneratedAsset[]) => void;
}

function CustomizationSection({
  podcastProp,
  onAssetsUpdate
}: CustomizationSectionProps) {
  const engineRef = useRef<CreativeEngine | null>(null);
  const [podcast, setPodcast] = useState<Podcast>(podcastProp);
  const [message, setMessage] = useState("Don't miss the latest episode");
  const [debouncedMessage, setDebouncedMessage] = useState(message);
  const [backgroundColor, setBackgroundColor] = useState('#93F');
  const [debouncedBackgroundColor, setDebouncedBackgroundColor] =
    useState(backgroundColor);
  const selectedSizeIndexes = useRef<number[]>([0, 1, 2]);
  const [type, setType] = useState('image');
  const [previewAsset, setPreviewAsset] = useState<GeneratedAsset>({
    id: -1,
    label: 'Preview',
    isLoading: true,
    width: 800,
    height: 800,
    src: null
  });
  const [finalAssets, setFinalAssets] = useState<GeneratedAsset[]>([]);

  const backgroundColorRGBA = useMemo(() => {
    let { r, g, b } = hexToRgba(backgroundColor);
    // The engine works with color values from 0 to 1 instead of 0 to 255.
    return { r: r / 255, g: g / 255, b: b / 255 };
  }, [backgroundColor]);

  const [videoSupported, setVideoSupported] = useState<boolean>(true);

  const assetsStillLoading = useMemo(() => {
    return (
      previewAsset.isLoading || finalAssets.some((asset) => asset.isLoading)
    );
  }, [previewAsset, finalAssets]);

  useEffect(() => {
    const config: Partial<Configuration> = {
      license: process.env.NEXT_PUBLIC_LICENSE
    };
    CreativeEngine.init(config).then(async (engine) => {
      engine.addDefaultAssetSources();
      engine.addDemoAssetSources({ sceneMode: 'Design' });
      engineRef.current = engine;
      async function getSupportsVideoExport() {
        const supported = await supportsVideoExport();
        setVideoSupported(supported);
      }
      getSupportsVideoExport();
      loadPodcastAssets();
    });

    return function shutdownCreativeEngine() {
      engineRef.current?.dispose();
    };
  }, []);

  const fillTemplate = (engine: CreativeEngine, page: number) => {
    let { r, g, b } = backgroundColorRGBA;
    engine.block.setColor(page, 'fill/solid/color', { r, g, b, a: 1 });
    if (podcast) {
      const photoBlocks = engine.block.findByName('PodcastCover');
      photoBlocks.forEach((photoBlock: number) => {
        const photoFillBlock = engine.block.getFill(photoBlock);
        engine.block.setString(
          photoFillBlock,
          'fill/image/imageFileURI',
          podcast.artworkUrl600
        );
      });
    }
    const colorTheme = getThemeColorFromBackgroundColor(backgroundColorRGBA);
    const [badgeBlock] = engine.block.findByName('PodcastBadge');
    engine.block.setString(
      engine.block.getFill(badgeBlock),
      'fill/image/imageFileURI',
      caseAssetPath(
        `/podcast-badge-${colorTheme === 'light' ? 'black' : 'white'}.png`
      )
    );
    // set texts
    const [messageBlock] = engine.block.findByName('Message & Name');
    engine.block.replaceText(
      messageBlock,
      (debouncedMessage ? `${debouncedMessage}\n` : '') +
        (podcast
          ? podcast.collectionName
          : debouncedMessage
            ? ''
            : 'Example Podcast')
    );
    const rgb =
      colorTheme === 'dark' ? { r: 1, g: 1, b: 1 } : { r: 0, g: 0, b: 0 };
    engine.block.setTextColor(
      messageBlock,
      { ...rgb, a: 0.75 },
      0,
      debouncedMessage.length
    );
    engine.block.setTextColor(
      messageBlock,
      { ...rgb, a: 1.0 },
      debouncedMessage.length
    );
  };

  const generateAsset = async (sizeIndex: number) => {
    const engine = engineRef?.current;
    if (!engine) return;

    setFinalAssets((oldAssets) => {
      const oldAssetIndex = oldAssets.findIndex(
        (oldAsset) => oldAsset.id === (sizeIndex as unknown as number)
      );
      if (oldAssetIndex === -1) {
        return [
          ...oldAssets,
          {
            id: sizeIndex,
            isLoading: true,
            ...SIZES[sizeIndex],
            src: null,
            type: type,
            sceneString: null
          }
        ];
      } else {
        oldAssets[oldAssetIndex] = {
          ...oldAssets[oldAssetIndex],
          isLoading: true,
          src: null,
          type: type,
          sceneString: null
        };
        return [...oldAssets];
      }
    });

    const size = SIZES[sizeIndex];
    let blob: Blob;
    let path = `/${type === 'image' ? 'static' : 'video'}-${size.label
      .replace('/', '')
      .replace('  ', '-')
      .replace(' ', '-')
      .toLowerCase()}-template.scene`;
    await engine.scene.loadFromURL(caseAssetPath(path));
    const page = engine.scene.getCurrentPage() as number;
    fillTemplate(engine, page);
    if (type === 'image') {
      blob = await engine.block.export(engine.scene.get() as number, {
        mimeType: 'image/png',
        targetWidth: size.width,
        targetHeight: size.height
      });
    } else {
      blob = await engine.block.exportVideo(page, {
        mimeType: 'video/mp4',
        targetWidth: size.width,
        targetHeight: size.height
      });
    }
    const assetSceneString = await engine.scene.saveToString();
    setFinalAssets((oldAssets) => {
      const oldAssetIndex = oldAssets.findIndex(
        (oldAsset) => oldAsset.id === (sizeIndex as unknown as number)
      );
      oldAssets[oldAssetIndex] = {
        ...oldAssets[oldAssetIndex],
        src: URL.createObjectURL(blob),
        isLoading: false,
        sceneString: assetSceneString
      };
      return [...oldAssets];
    });
  };

  const handleSizeSelectionChange = (index: number) => {
    if (selectedSizeIndexes.current.includes(index)) {
      selectedSizeIndexes.current = selectedSizeIndexes.current.filter(
        (i) => i !== index
      );
      setFinalAssets(finalAssets.filter((asset) => asset.id !== index));
    } else {
      selectedSizeIndexes.current = [...selectedSizeIndexes.current, index];
      generateAsset(index);
    }
  };

  const loadPodcastAssets = async () => {
    const engine = engineRef?.current;
    if (!engine) return;
    await engine.scene.loadFromURL(
      caseAssetPath(
        `/${
          type === 'image' ? 'static' : 'video'
        }-instagram-post-template.scene`
      )
    );
    const [page] = engine.block.findByKind('page');
    // Make the page fit its parent container.
    engine.scene.zoomToBlock(page, 0, 0);
    // generate preview
    setPreviewAsset({
      ...previewAsset,
      isLoading: true,
      src: null
    });
    // let react render
    await new Promise((resolve) => setTimeout(resolve, 0));
    fillTemplate(engine, page);
    let blob: Blob;
    if (type === 'image') {
      blob = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: previewAsset.width,
        targetHeight: previewAsset.height
      });
    } else {
      blob = await engine.block.exportVideo(page, {
        mimeType: 'video/mp4',
        targetWidth: previewAsset.width,
        targetHeight: previewAsset.height
      });
    }
    setPreviewAsset({
      ...previewAsset,
      isLoading: false,
      src: URL.createObjectURL(blob)
    });
    const sceneString = await engine.scene.saveToString();
    for (const sizeIndex of selectedSizeIndexes.current) {
      await generateAsset(sizeIndex);
    }
    await engine.scene.loadFromString(sceneString);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBackgroundColor(backgroundColor);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [backgroundColor]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMessage(message);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [message]);

  // Prevent infinite loading by waiting for all assets to be loaded before reload
  useEffect(() => {
    if (
      !assetsStillLoading &&
      ((podcastProp && !podcast) ||
        (podcast && podcastProp.collectionId !== podcast.collectionId))
    ) {
      setPodcast(podcastProp);
    }
  }, [podcastProp, assetsStillLoading]);

  useEffect(() => {
    const oldBackgroundColor = backgroundColor;
    const extractColor = async (url: string) => {
      const mainColor = await getMainColor(url);
      setBackgroundColor(mainColor);
    };
    if (podcast) {
      extractColor(podcast.artworkUrl600);
      if (oldBackgroundColor !== backgroundColor && engineRef.current) {
        loadPodcastAssets();
      }
    }
  }, [podcast]);

  useEffect(() => {
    if (engineRef.current) loadPodcastAssets();
  }, [debouncedMessage, debouncedBackgroundColor, type]);

  useEffect(() => {
    onAssetsUpdate(finalAssets);
  }, [finalAssets]);

  return (
    <>
      <div className={classes.inputsWrapper}>
        <div className={classes.inputWrapper}>
          <p className={'h4'}>Message</p>
          <input
            className={classes.messageInput}
            type="text"
            value={message}
            placeholder="Don't miss the latest episode"
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>
        <div
          className={classes.inputWrapper}
          style={{
            pointerEvents: assetsStillLoading ? 'none' : 'auto',
            cursor: assetsStillLoading ? 'wait' : 'pointer'
          }}
        >
          <p className={'h4'}>Background Color</p>
          <ColorPicker
            name="background-color-picker"
            value={backgroundColor}
            onChange={(value) => setBackgroundColor(value)}
            presetColors={[
              '#FF33DD',
              '#9933FF',
              '#335FFF',
              '#33BBFF',
              '#00D8A4',
              '#FFD333',
              '#FF7433',
              '#FF3333'
            ]}
            defaultValue="#9933FF"
            size="sm"
            positionX="left"
            positionY="bottom"
          />
        </div>
        <div className={classes.inputWrapper}>
          <p className={'h4'}>Sizes</p>
          <div className={classes.sizeInputsWrapper}>
            {SIZES.map((size, index) => (
              <label
                key={index}
                htmlFor={size.label}
                className={classNames(classes.sizeInputWrapper, {
                  [classes.selectedSizeInput]:
                    selectedSizeIndexes.current.includes(index)
                })}
              >
                <input
                  className={classes.sizeInput}
                  type="checkbox"
                  checked={selectedSizeIndexes.current.includes(index)}
                  onChange={() => handleSizeSelectionChange(index)}
                  name={size.label}
                  value={size.label}
                  id={size.label}
                />
                <p className={classes.bold}>{size.label}</p>
                <p>{`${size.width} × ${size.height} px`}</p>
              </label>
            ))}
          </div>
        </div>
        <div className={classes.inputWrapper}>
          <p className={'h4'}>Type</p>
          <div className={classes.typeInputWrapper}>
            <SegmentedControl
              options={[
                { label: 'Image', value: 'image' },
                { label: 'Video', value: 'video' }
              ]}
              value={type}
              name="type"
              onChange={(value) => {
                setType(value);
              }}
              buttonStyle={{
                borderRadius: '8px'
              }}
              size="md"
              disabled={!videoSupported || assetsStillLoading ? true : false}
            />
          </div>

          {!videoSupported && (
            <div className={classes.warningText}>
              <span>
                <WarningIcon />
              </span>
              <p>Video is only supported in Chromium-based browsers.</p>
            </div>
          )}
        </div>
      </div>
      <div className={classes.previewWrapper}>
        <h4 className={'h4'}>Preview</h4>
        <div
          className={classNames(
            classes.previewImageWrapper,
            previewAsset.isLoading ? classes.loading : ''
          )}
        >
          {previewAsset.isLoading ? (
            <LoadingSpinner />
          ) : type === 'image' ? (
            <img
              className={classes.previewImage}
              data-cy={!previewAsset.isLoading ? 'export-image' : ''}
              src={previewAsset.src as string}
              alt={previewAsset.label}
            />
          ) : (
            <video
              className={classes.previewImage}
              data-cy={!previewAsset.isLoading ? 'export-image' : ''}
              src={previewAsset.src as string}
              autoPlay
              loop
              muted
            />
          )}
        </div>
      </div>
    </>
  );
}

function getThemeColorFromBackgroundColor(rgb: RGBColor) {
  const { r, g, b } = rgb;
  const [R, G, B] = [r, g, b].map((i) =>
    i <= 0.04045 ? i / 12.92 : ((i + 0.055) / 1.055) ** 2.4
  );
  const relativeLuminance = 0.299 * R + 0.587 * G + 0.114 * B;
  return relativeLuminance > 0.38 ? 'light' : 'dark';
}

async function getMainColor(src: string): Promise<string> {
  /* https://stackoverflow.com/questions/2541481/get-average-color-of-image-via-javascript */
  return new Promise((resolve) => {
    let context = document.createElement('canvas')?.getContext('2d');
    context!.imageSmoothingEnabled = true;

    let img = new Image();
    img.src = src;
    img.crossOrigin = '';

    img.onload = () => {
      context!.drawImage(img, 0, 0, 1, 1);
      const i = context!.getImageData(0, 0, 1, 1).data;
      resolve(
        '#' +
          ((1 << 24) + (i[0] << 16) + (i[1] << 8) + i[2]).toString(16).slice(1)
      );
    };
  });
}

export default CustomizationSection;
