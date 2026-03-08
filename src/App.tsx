import { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar/SearchBar";
import { fetchTrendingGifs, fetchSearchedGifs } from "./store/apiFetchHelper";
import styles from "./App.module.scss";
import GifVideoBlock from "./components/GifVideoBlock/GifVideoBlock";
import { GifViewPage } from "./components/Pages/GifViewPage/GifViewPage";
import { useQueryParam } from "./store/QueryParams";
import { ErrorAlert } from "./components/Alerts/Alerts";

export type Gif = {
  id: string;
  title: string;
  images: {
    original: {
      mp4: string;
      url: string;
    };
  };
};

function App() {
  const [searchURLValue, setSearchURLValue] = useQueryParam("search", "");

  const [gifs, setGifs] = useState<Gif[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedGif, setSelectedGif] = useState<Gif | null>(null);

  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setSearchTerm(searchURLValue);
  }, [searchURLValue]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        if (searchURLValue) {
          await fetchSearchedGifs(searchURLValue, setGifs, setErrorMessage);
        } else {
          await fetchTrendingGifs(setGifs, setErrorMessage);
        }
      } catch (error) {
        console.error("Error fetching gifs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchURLValue]);

  const handleSubmitSearch = (debouncedSearchTerm?: string) => {
    setSearchURLValue(debouncedSearchTerm || searchTerm);
  };

  const handleLogoClick = () => {
    setSelectedGif(null);
    setSearchURLValue("");
    setSearchTerm("");
  };

  return (
    <div className={styles.App}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.logo} onClick={handleLogoClick}>
            <span className={styles.logoAccent}>GIF</span>Search
          </span>
        </div>
      </header>

      {selectedGif ? (
        <GifViewPage
          gif={selectedGif}
          returnToPreviousPage={() => setSelectedGif(null)}
        />
      ) : (
        <div className={styles.trendingContent}>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSubmitSearch={handleSubmitSearch}
          />
          <section className={styles.resultsSection}>
            <h2 className={styles.sectionTitle}>
              {searchURLValue ? (
                <>
                  Results for{" "}
                  <span className={styles.searchQuery}>
                    "{searchURLValue}"
                  </span>
                </>
              ) : (
                "Trending GIFs"
              )}
            </h2>

            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner} />
                <p>Loading GIFs...</p>
              </div>
            ) : gifs.length === 0 && !errorMessage ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyStateTitle}>No GIFs found</p>
                <p className={styles.emptyStateSubtitle}>
                  Try searching for something else
                </p>
              </div>
            ) : (
              <div className={styles.masonryContainer}>
                {gifs.map((gif) => (
                  <GifVideoBlock
                    key={gif.id}
                    gif={gif}
                    setSelectedGif={setSelectedGif}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {errorMessage && <ErrorAlert errorMessage={errorMessage} />}
    </div>
  );
}

export default App;
