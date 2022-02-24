import { IShowcase } from 'components/show-cases';
import { buildUrl } from 'lib/paths';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ showcase }: { showcase: IShowcase }) => {
  const currentTitle = useMemo(
    () => `${showcase.title} | CE.SDK Web Demo`,
    [showcase]
  );
  const currentDescription = useMemo(
    () => `${showcase.description}`,
    [showcase]
  );
  return (
    <Helmet>
      <meta name="description" content={currentDescription} />
      <meta name="title" content={currentTitle} />
      <title>{currentTitle}</title>

      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={buildUrl(`preview/${showcase.id}.png`)}
      />
      <meta property="og:title" content={currentTitle} />
      <meta property="og:description" content={currentDescription} />
      <meta
        property="og:image"
        content={buildUrl(`preview/${showcase.id}.png`)}
      />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={buildUrl(`${showcase.id}`)} />
      <meta property="twitter:title" content={currentTitle} />
      <meta property="twitter:description" content={currentDescription} />
      <meta
        property="twitter:image"
        content={buildUrl(`preview/${showcase.id}.png`)}
      />
    </Helmet>
  );
};

export default Meta;
