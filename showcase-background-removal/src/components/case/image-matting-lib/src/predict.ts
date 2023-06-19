import { imageDataResize } from './utils';

export type Tensor = {
  shape: number[];
  data: ArrayBuffer;
  dataType: 'float32';
};
export type Imports = {
  createTensor?(data: ArrayBuffer, shape: number[], dataType: string): Tensor;
  destroyTensor?(tensor: Tensor): void;
  createSession: (model: any) => Promise<any>;
  destroySession?(session: any): void;
  runSession(
    session: any,
    input: Record<string, Tensor>
  ): Promise<Record<string, Tensor>>;
};
export type InferenceParams = {
  image: ImageData;
  resolution: number;
  alphaTreshold: number;
  output: 'foreground' | 'mask' | 'background';
};

function calculateProportionalSize(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): [number, number] {
  // Calculate the scaling factors for width and height
  const widthRatio = maxWidth / originalWidth;
  const heightRatio = maxHeight / originalHeight;

  // Use the smaller scaling factor to ensure the image fits within the specified dimensions
  const scalingFactor = Math.min(widthRatio, heightRatio);

  // Calculate the new width and height
  const newWidth = Math.floor(originalWidth * scalingFactor);
  const newHeight = Math.floor(originalHeight * scalingFactor);

  return [newWidth, newHeight];
}

export async function initInferenceSession(
  model: ArrayBuffer,
  imports: Imports
) {
  const session = await imports.createSession(model);
  return session;
}

export async function runInferenceSession(
  session: any,
  params: InferenceParams,
  imports: Imports
): Promise<ImageData> {
  const resolution = params.resolution;
  const imageData = params.image;
  const dims = [1, 3, resolution, resolution];
  const tensorImage = await imageDataResize(imageData, resolution, resolution);
  const inputTensorData = imageDataToFloat32Array(tensorImage, dims);

  const predictionsDict = await imports.runSession(session, {
    input: { data: inputTensorData, shape: dims, dataType: 'float32' }
  });
  const predictions = predictionsDict['output'].data;

  const stride = resolution * resolution;

  let alphaData = new ImageData(tensorImage.width, tensorImage.height);

  // Copy alpha channel from tensor
  if (params.output === 'foreground') {
    for (let i = 0; i < 4 * stride; i += 4) {
      let alpha = predictions[i / 4];
      alpha = alpha > params.alphaTreshold ? alpha : 0;
      alphaData.data[i + 0] = tensorImage.data[i + 0];
      alphaData.data[i + 1] = tensorImage.data[i + 1];
      alphaData.data[i + 2] = tensorImage.data[i + 2];
      alphaData.data[i + 3] = alpha * 255;
    }
  } else if (params.output === 'mask') {
    for (let i = 0; i < 4 * stride; i += 4) {
      let alpha = predictions[i / 4];
      alpha = alpha > params.alphaTreshold ? alpha : 0;
      alphaData.data[i + 3] = alpha * 255;
    }
  } else if (params.output === 'background') {
    for (let i = 0; i < 4 * stride; i += 4) {
      let alpha = predictions[i / 4];
      alpha = alpha > params.alphaTreshold ? alpha : 0;
      alphaData.data[i + 0] = tensorImage.data[i + 0];
      alphaData.data[i + 1] = tensorImage.data[i + 1];
      alphaData.data[i + 2] = tensorImage.data[i + 2];
      alphaData.data[i + 3] = (1.0 - alpha) * 255;
    }
  }

  const [width, height] = calculateProportionalSize(
    imageData.width,
    imageData.height,
    resolution,
    resolution
  );
  // TODO resize to original size removes transparency
  alphaData = await imageDataResize(alphaData, width, height);

  return alphaData;
}

function imageDataToFloat32Array(
  image: ImageData,
  dims: number[],
  packed: boolean = false
): Float32Array {
  var imageBufferData = image.data;

  const stride = image.width * image.height;
  const float32Data = new Float32Array(3 * stride);

  if (packed) {
    // rgb_0, rgb_1
    dims = [dims[0], dims[2], dims[3], dims[1]];
    for (let i = 0, j = 0; i < imageBufferData.length; i += 4, j += 3) {
      float32Data[j + 0] = imageBufferData[i + 0] / 255.0 - 0.5;
      float32Data[j + 1] = imageBufferData[i + 1] / 255.0 - 0.5;
      float32Data[j + 2] = imageBufferData[i + 2] / 255.0 - 0.5;
    }
  } else {
    // r_0, r_1, .... g_0,g_1, .... b_0
    for (let i = 0, j = 0; i < imageBufferData.length; i += 4, j += 1) {
      float32Data[j] = imageBufferData[i] / 255.0 - 0.5;
      float32Data[j + stride] = imageBufferData[i + 1] / 255.0 - 0.5;
      float32Data[j + stride + stride] = imageBufferData[i + 2] / 255.0 - 0.5;
    }
  }

  return float32Data;
}
