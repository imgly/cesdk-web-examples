"use client";

import dynamic from "next/dynamic";

const CreativeEditorSDKNoSSR = dynamic(
  () => import("./CreativeEditorSDK"),
  {
    ssr: false,
  }
);

export default CreativeEditorSDKNoSSR;
