'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RiCloseLine, RiArrowLeftSLine, RiArrowRightSLine, RiVolumeMuteLine, RiVolumeUpLine } from 'react-icons/ri';

/**
 * Full-screen 9:16 video overlay with navigation.
 *
 * Props:
 *  - videos: Array<{ videoUrl, name, handle }> — all UGC videos
 *  - activeIndex: number — the index to start from
 *  - onClose: () => void
 */
const UGCVideoOverlay = ({ videos = [], activeIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === videos.length - 1;

  // Sync when activeIndex prop changes (overlay re-opens)
  useEffect(() => {
    setCurrentIndex(activeIndex);
  }, [activeIndex]);

  // Auto-play current video whenever currentIndex changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset & play
    video.pause();
    video.currentTime = 0;
    video.load(); // force reload the new src
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked — muted autoplay should still work
      });
    }
  }, [currentIndex]);

  // Lock body scroll while overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft' && !isFirst) goTo(currentIndex - 1);
      if (e.key === 'ArrowRight' && !isLast) goTo(currentIndex + 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, isFirst, isLast]);

  const handleClose = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    onClose?.();
  }, [onClose]);

  const goTo = useCallback((idx) => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setCurrentIndex(idx);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const currentVideo = videos[currentIndex];
  if (!currentVideo) return null;

  return (
    <div className="ugc-overlay" onClick={handleClose}>
      <div
        className="ugc-overlay__container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left nav */}
        <button
          className="ugc-overlay__nav ugc-overlay__nav--left"
          disabled={isFirst}
          onClick={() => goTo(currentIndex - 1)}
          aria-label="Previous video"
        >
          <RiArrowLeftSLine />
        </button>

        {/* Video */}
        <div className="ugc-overlay__video-wrapper">
          {/* Close button */}
          <button
            className="ugc-overlay__close"
            onClick={handleClose}
            aria-label="Close"
          >
            <RiCloseLine />
          </button>

          <video
            ref={videoRef}
            key={currentVideo.videoUrl}
            className="ugc-overlay__video"
            src={currentVideo.videoUrl}
            muted={isMuted}
            autoPlay
            playsInline
            loop
            preload="auto"
          />

          {/* Mute toggle */}
          <button
            className="ugc-overlay__mute"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <RiVolumeMuteLine /> : <RiVolumeUpLine />}
          </button>

          {/* User info */}
          <div className="ugc-overlay__info">
            <span className="ugc-overlay__name">{currentVideo.name}</span>
            {currentVideo.handle && (
              <span className="ugc-overlay__handle">
                @{currentVideo.handle}
              </span>
            )}
          </div>
        </div>

        {/* Right nav */}
        <button
          className="ugc-overlay__nav ugc-overlay__nav--right"
          disabled={isLast}
          onClick={() => goTo(currentIndex + 1)}
          aria-label="Next video"
        >
          <RiArrowRightSLine />
        </button>
      </div>
    </div>
  );
};

export default UGCVideoOverlay;
