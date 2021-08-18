import CreativeEditorSDKWithNoSSR  from '../components/CreativeEditorSDKNoSSR'

export default function Home() {
  let config = {
    // baseURL: 'assets/'
  }
  return <CreativeEditorSDKWithNoSSR config={config} />
}
