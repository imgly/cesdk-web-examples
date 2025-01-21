import { useState, useEffect } from 'react';
import classes from './PodcastSearchSection.module.css';
import classNames from 'classnames';
import { caseAssetPath } from '../util';

export interface Podcast {
  artistName: string;
  artworkUrl600: string;
  collectionId: number;
  collectionName: string;
  collectionViewUrl: string;
}

interface PodcastSearchSectionProps {
  currentPodcast: Podcast;
  onPodcastSelect: (podcast: Podcast) => void;
}

function PodcastSearchSection({
  currentPodcast,
  onPodcastSelect
}: PodcastSearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [podcastLoadedState, setPodcastLoadedState] = useState(
    Array(5).fill(false)
  );

  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    fetchPodcastsData(debouncedQuery);
  }, [debouncedQuery]);

  const fetchPodcastsData = async (query: string) => {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?entity=podcast&limit=4&term=${query}`
      );
      const data = await response.json();
      setPodcastLoadedState(Array(5).fill(false));
      setPodcasts(data.results);
    } catch (error) {
      console.error('Failed to fetch podcasts', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h4 className={'h3'}>Search Podcast</h4>
      <div className={classes.searchWrapper}>
        <input
          className={classes.searchBar}
          type="text"
          value={searchQuery}
          placeholder="e.g. “Conan O Brien Needs A Friend”"
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <div className={classes.searchResults}>
          {isLoading || podcasts.length === 0
            ? [...Array(5)].map((i, index) => (
                <div
                  key={index}
                  className={classNames(
                    classes.podcastResultCard, classes.disabled,
                    isLoading ? classes.loading : ''
                  )}
                >
                  <div className={classes.placeholderImageWrapper}>
                    <img
                      src={caseAssetPath('/placeholder-search-result.png')}
                      alt="Search Placeholder"
                      className={classes.placeholderImage}
                    />
                  </div>
                  <div className={classes.placeholderTextSection}>
                    <div
                      className={classNames(classes.placeholderText, classes.long)}
                  
                    />
                    <div
                   className={classNames(classes.placeholderText, classes.short)}
                    />
                  </div>
                </div>
              ))
            : podcasts.map((podcast, index) => (
                <button
                  key={podcast.collectionId}
                  className={classNames(classes.podcastResultCard, {
                    [classes.selected]:
                      podcast.collectionId === currentPodcast?.collectionId
                  })}
                  onClick={() => onPodcastSelect(podcast)}
                >
                  {!podcastLoadedState[index] && (
                    <div className={classes.loaderImageWrapper}>
                      <img
                        src={caseAssetPath('/placeholder-search-result.png')}
                        alt="Search Placeholder"
                        className={classNames(
                          classes.loaderImage,
                          classes.loading
                        )}
                      />
                    </div>
                  )}
                  <img
                    src={podcast.artworkUrl600}
                    alt={podcast.collectionName}
                    className={classes.podcastResultCardImage}
                    onLoad={() => {
                      setPodcastLoadedState((oldLoadedState) => {
                        oldLoadedState[index] = true;
                        return [...oldLoadedState];
                      });
                    }}
                  />
                  <div className={classes.podcastResultCardText}>
                    <p
                      className={classNames(
                        classes.podcastResultCardTitle,
                        classes.truncate
                      )}
                    >
                      {podcast.collectionName}
                    </p>
                    <p className={classes.truncate}>{podcast.artistName}</p>
                  </div>
                </button>
              ))}
        </div>
      </div>
    </>
  );
}

export default PodcastSearchSection;
