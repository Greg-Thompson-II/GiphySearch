import { useState } from "react";
import type { Gif } from "../../../App";
import BackArrowIcon from "../../../assets/icons/BackArrowIcon";
import CopyIcon from "../../../assets/icons/CopyIcon";
import CheckIcon from "../../../assets/icons/CheckIcon";
import styles from "./GifViewPage.module.scss";
import { CopyAlert } from "../../Alerts/Alerts";

type Props = {
  gif: Gif;
  returnToPreviousPage: () => void;
};

export function GifViewPage({ gif, returnToPreviousPage }: Props) {
  const gifURL = gif.images.original.url;

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    if (!gifURL) return;

    try {
      await navigator.clipboard.writeText(gifURL);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  return (
    <div className={styles.GifContentPage}>
      <div className={styles.topBar}>
        <button onClick={returnToPreviousPage} className={styles.returnToHomeButton}>
          <BackArrowIcon />
          <span>Back</span>
        </button>
      </div>

      <div className={styles.gifContent}>
        <h2 className={styles.gifTitle}>{gif.title}</h2>
        <video loop autoPlay muted key={gif.id} className={styles.gifVideo}>
          <source src={gif.images.original.mp4} type="video/mp4" />
        </video>

        <div className={styles.urlSection}>
          <span className={styles.urlLabel}>Direct URL</span>
          <div className={styles.urlRow}>
            <p className={styles.urlText}>{gifURL}</p>
            <button onClick={handleCopy} className={`${styles.copyButton} ${isCopied ? styles.copied : ""}`}>
              {isCopied ? (
                <>
                  <CheckIcon />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <CopyIcon />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isCopied && <CopyAlert />}
    </div>
  );
}
