import React, { useState } from "react";
import type { Gif } from "../../App";
import styles from "./GifVideoBlock.module.scss";
import CopyIcon from "../../assets/icons/CopyIcon";
import CheckIcon from "../../assets/icons/CheckIcon";
import { CopyAlert } from "../Alerts/Alerts";

type Props = {
  gif: Gif;
  setSelectedGif: React.Dispatch<React.SetStateAction<Gif | null>>;
};

export default function GifVideoBlock({ gif, setSelectedGif }: Props) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    if (!gif.images.original.url) return;

    try {
      await navigator.clipboard.writeText(gif.images.original.url);
      setIsCopied(true);

      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };
  return (
    <div className={styles.masonryItem}>
      <video
        width="320"
        loop
        autoPlay
        muted
        key={gif.id}
        onClick={() => setSelectedGif(gif)}
      >
        <source src={gif.images.original.mp4} type="video/mp4"></source>
      </video>

      <div className={styles.hoverOverlay} onClick={() => setSelectedGif(gif)}>
        {gif.title && <p className={styles.gifTitle}>{gif.title}</p>}
      </div>

      <button onClick={handleCopy} className={styles.copyButton}>
        {isCopied ? (
          <span>
            <CheckIcon className={styles.checkIcon} /> <p>Copied!</p>
          </span>
        ) : (
          <span>
            <CopyIcon /> <p>Copy URL</p>
          </span>
        )}
      </button>

      {isCopied && <CopyAlert />}
    </div>
  );
}
