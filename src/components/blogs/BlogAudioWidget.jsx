'use client';

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  RiLoader4Line,
  RiPauseLine,
  RiPlayFill,
  RiSettings3Line,
  RiVolumeUpLine,
  RiCloseLine,
  RiRestartLine,
} from 'react-icons/ri';
import ThemeOptionContext from '@/helper/themeOptionsContext';

const stripHtml = (htmlString) => {
  if (!htmlString) return '';
  if (typeof window === 'undefined') return htmlString;
  const div = document.createElement('div');
  div.innerHTML = htmlString;
  return div.textContent || div.innerText || '';
};

const BlogAudioWidget = ({ title, subtitle, content }) => {
  const { themeOption } = useContext(ThemeOptionContext);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false); // Track if speech has ended
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSupported, setIsSupported] = useState(false);
  const [themeColor, setThemeColor] = useState('#0da487');

  const utteranceRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const widgetRef = useRef(null);
  const baseDurationRef = useRef(0); // Store base duration at 1x speed
  const startTimeRef = useRef(0); // Track when playback started
  const startPositionRef = useRef(0); // Track position when playback started

  const textToSpeak = useMemo(() => {
    const plainContent = stripHtml(content);
    return [title, subtitle, plainContent].filter(Boolean).join('. ');
  }, [title, subtitle, content]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasSupport = 'speechSynthesis' in window;
    setIsSupported(hasSupport);
    if (!hasSupport) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      
      // Priority order for default voice selection:
      // 1. Indian English voices
      // 2. English voices (Google/Natural/Premium)
      // 3. Any English voice
      // 4. First available voice
      const defaultVoice =
        available.find(
          (v) =>
            v.lang?.includes('en-IN') || 
            v.lang?.includes('hi-IN') ||
            v.name?.toLowerCase().includes('indian')
        ) ||
        available.find(
          (v) =>
            v.lang?.startsWith('en') &&
            (v.name?.includes('Google') ||
              v.name?.includes('Natural') ||
              v.name?.includes('Premium'))
        ) || 
        available.find((v) => v.lang?.startsWith('en')) || 
        available[0];
        
      setSelectedVoice((prev) => prev || defaultVoice || null);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (!isSupported || !textToSpeak) return;
    initializeAudio();
    return () => {
      window.speechSynthesis.cancel();
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [textToSpeak, isSupported]); // Removed speed, pitch, selectedVoice from dependencies

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Get theme color from themeOption or CSS variable
    const primaryColor = themeOption?.general?.primary_color;
    if (primaryColor) {
      setThemeColor(primaryColor);
    } else {
      // Fallback to CSS variable
      const cssThemeColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-color')
        .trim();
      if (cssThemeColor) {
        setThemeColor(cssThemeColor);
      }
    }
  }, [themeOption]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const styleId = 'blog-audio-widget-spinner';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes blogAudioWidgetSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const initializeAudio = () => {
    // Calculate base duration at 1x speed and store it
    const estimatedDuration = calculateDuration(textToSpeak, 1);
    baseDurationRef.current = estimatedDuration;
    setDuration(estimatedDuration);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = speed;
    utterance.pitch = pitch;
    utterance.volume = 1;
    utteranceRef.current = utterance;
    setIsReady(true);
  };

  const calculateDuration = (text, rate) => {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return (wordCount / 150) * 60 / rate;
  };

  const startProgressTracking = (utterance) => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    // Record start time and position
    startTimeRef.current = Date.now();
    startPositionRef.current = currentTime;
    
    // Calculate remaining duration based on remaining words and current speed
    const words = textToSpeak.split(/\s+/);
    const wordsPerSecond = 150 / 60; // Base rate
    const wordsToSkip = Math.floor(currentTime * wordsPerSecond);
    const remainingWords = words.length - wordsToSkip;
    const remainingBaseDuration = (remainingWords / 150) * 60; // Duration at 1x
    const remainingActualDuration = remainingBaseDuration / speed; // Actual duration at current speed
    
    // More frequent updates for smoother progress
    progressIntervalRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        const elapsedRealSeconds = (Date.now() - startTimeRef.current) / 1000;
        // Calculate progress in base duration terms
        const progressInBaseDuration = elapsedRealSeconds * speed;
        const newTime = Math.min(startPositionRef.current + progressInBaseDuration, baseDurationRef.current);
        
        setCurrentTime(newTime);
        
        if (newTime >= baseDurationRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      }
    }, 50); // Update more frequently (50ms instead of 100ms)
  };

  const togglePlayPause = () => {
    if (!isSupported || !textToSpeak) return;
    
    // If ended, restart from beginning
    if (hasEnded) {
      setHasEnded(false);
      setCurrentTime(0);
      
      // Create new utterance from the beginning
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = speed;
      utterance.pitch = pitch;
      utterance.volume = 1;
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onend = () => {
        setIsPlaying(false);
        setHasEnded(true);
        setCurrentTime(baseDurationRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      
      // Reset progress tracking from zero
      startTimeRef.current = Date.now();
      startPositionRef.current = 0;
      
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = setInterval(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          const elapsedRealSeconds = (Date.now() - startTimeRef.current) / 1000;
          const progressInBaseDuration = elapsedRealSeconds * speed;
          const newTime = Math.min(progressInBaseDuration, baseDurationRef.current);
          
          setCurrentTime(newTime);
          
          if (newTime >= baseDurationRef.current) {
            clearInterval(progressIntervalRef.current);
          }
        }
      }, 50);
      
      return;
    }
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const words = textToSpeak.split(/\s+/);
    // Calculate word position based on base duration (1x speed)
    const wordsPerSecond = 150 / 60; // Base rate at 1x
    const wordsToSkip = Math.floor(currentTime * wordsPerSecond);
    const textFromCurrent = words.slice(wordsToSkip).join(' ');

    const utterance = new SpeechSynthesisUtterance(textFromCurrent);
    utterance.rate = speed;
    utterance.pitch = pitch;
    utterance.volume = 1;
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onend = () => {
      setIsPlaying(false);
      setHasEnded(true);
      setCurrentTime(baseDurationRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    startProgressTracking(utterance);
  };

  const stopPlayback = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setHasEnded(false);
    setCurrentTime(0);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const handleSeek = (e) => {
    if (!baseDurationRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = Math.min(Math.max(percent * baseDurationRef.current, 0), baseDurationRef.current);
    setCurrentTime(newTime);
    setHasEnded(false); // Reset ended state when seeking

    // Always restart playback from the new position, whether it was playing or not
    const wasPlaying = isPlaying;
    
    // Stop any current playback
    window.speechSynthesis.cancel();
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    // Only restart if it was playing before
    if (wasPlaying) {
      const words = textToSpeak.split(/\s+/);
      // Use base rate to calculate position
      const wordsPerSecond = 150 / 60;
      const wordsToSkip = Math.floor(newTime * wordsPerSecond);
      const textFromCurrent = words.slice(wordsToSkip).join(' ');

      const utterance = new SpeechSynthesisUtterance(textFromCurrent);
      utterance.rate = speed;
      utterance.pitch = pitch;
      utterance.volume = 1;
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onend = () => {
        setIsPlaying(false);
        setHasEnded(true);
        setCurrentTime(baseDurationRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      };

      utteranceRef.current = utterance;
      
      // Small delay to ensure proper restart
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
        
        // Restart progress tracking from new position
        startTimeRef.current = Date.now();
        startPositionRef.current = newTime;
        
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = setInterval(() => {
          if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            const elapsedRealSeconds = (Date.now() - startTimeRef.current) / 1000;
            const progressInBaseDuration = elapsedRealSeconds * speed;
            const currentNewTime = Math.min(startPositionRef.current + progressInBaseDuration, baseDurationRef.current);
            
            setCurrentTime(currentNewTime);
            
            if (currentNewTime >= baseDurationRef.current) {
              clearInterval(progressIntervalRef.current);
            }
          }
        }, 50);
      }, 50);
    }
  };

  const changeVoice = (voice) => {
    setSelectedVoice(voice);
    if (utteranceRef.current) utteranceRef.current.voice = voice;
  };

  const handleSpeedChange = (newSpeed) => {
    const wasPlaying = isPlaying;
    
    if (wasPlaying) {
      // Stop current playback and tracking
      window.speechSynthesis.cancel();
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      
      // Update speed
      setSpeed(newSpeed);
      
      // Resume playback with new speed
      const words = textToSpeak.split(/\s+/);
      // Use base rate to calculate position
      const wordsPerSecond = 150 / 60;
      const wordsToSkip = Math.floor(currentTime * wordsPerSecond);
      const textFromCurrent = words.slice(wordsToSkip).join(' ');

      const utterance = new SpeechSynthesisUtterance(textFromCurrent);
      utterance.rate = newSpeed;
      utterance.pitch = pitch;
      utterance.volume = 1;
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onend = () => {
        setIsPlaying(false);
        setHasEnded(true);
        setCurrentTime(baseDurationRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      };

      utteranceRef.current = utterance;
      
      // Small delay to ensure speech synthesis is ready
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
        
        // Restart progress tracking with updated speed
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        startTimeRef.current = Date.now();
        startPositionRef.current = currentTime;
        
        progressIntervalRef.current = setInterval(() => {
          if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            const elapsedRealSeconds = (Date.now() - startTimeRef.current) / 1000;
            const progressInBaseDuration = elapsedRealSeconds * newSpeed;
            const newTime = Math.min(startPositionRef.current + progressInBaseDuration, baseDurationRef.current);
            
            setCurrentTime(newTime);
            
            if (newTime >= baseDurationRef.current) {
              clearInterval(progressIntervalRef.current);
            }
          }
        }, 50);
      }, 50);
    } else {
      // Just update speed if not playing
      setSpeed(newSpeed);
    }
  };

  const handlePitchChange = (newPitch) => {
    const wasPlaying = isPlaying;
    
    if (wasPlaying) {
      // Stop current playback
      window.speechSynthesis.cancel();
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      
      // Update pitch
      setPitch(newPitch);
      
      // Resume playback with new pitch
      const words = textToSpeak.split(/\s+/);
      // Use base rate to calculate position
      const wordsPerSecond = 150 / 60;
      const wordsToSkip = Math.floor(currentTime * wordsPerSecond);
      const textFromCurrent = words.slice(wordsToSkip).join(' ');

      const utterance = new SpeechSynthesisUtterance(textFromCurrent);
      utterance.rate = speed;
      utterance.pitch = newPitch;
      utterance.volume = 1;
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onend = () => {
        setIsPlaying(false);
        setHasEnded(true);
        setCurrentTime(baseDurationRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      startProgressTracking(utterance);
    } else {
      // Just update pitch if not playing
      setPitch(newPitch);
    }
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <div
      ref={widgetRef}
      style={{
        position: 'relative',
        background: '#fff',
        border: '1px solid #0da487',
        borderRadius: '10px',
        padding: '8px 10px',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
        minWidth: '280px',
        // maxWidth: '400px',
        width: '100%',
      }}
      className="blog-audio-widget"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
        }}
      >
        <button
          onClick={togglePlayPause}
          disabled={!isReady || !isSupported}
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: !isSupported ? '#cbd5e1' : themeColor,
            border: 'none',
            borderRadius: '50%',
            cursor: isReady && isSupported ? 'pointer' : 'not-allowed',
            color: 'white',
            flexShrink: 0,
          }}
        >
          {!isReady ? (
            <RiLoader4Line
              style={{
                width: '16px',
                height: '16px',
                animation: 'blogAudioWidgetSpin 1s linear infinite',
              }}
            />
          ) : hasEnded ? (
            <RiRestartLine style={{ width: '16px', height: '16px' }} />
          ) : isPlaying ? (
            <RiPauseLine style={{ width: '16px', height: '16px' }} />
          ) : (
            <RiPlayFill style={{ width: '16px', height: '16px', marginLeft: '2px' }} />
          )}
        </button>

        {/* <button
          onClick={stopPlayback}
          disabled={!isSupported}
          style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '50%',
            cursor: isSupported ? 'pointer' : 'not-allowed',
            color: '#64748b',
            flexShrink: 0,
          }}
          title="Stop"
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              background: 'currentColor',
              borderRadius: '2px',
            }}
          />
        </button> */}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '4px',
            }}
          >
            <RiVolumeUpLine style={{ width: '14px', height: '14px', color: '#64748b' }} />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#1e293b',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              Listen
            </span>
          </div>

          <div
            onClick={handleSeek}
            style={{
              height: '3px',
              background: '#e2e8f0',
              borderRadius: '2px',
              cursor: isSupported ? 'pointer' : 'not-allowed',
              overflow: 'hidden',
              marginBottom: '3px',
            }}
          >
            <div
              style={{
                height: '100%',
                background: themeColor,
                width: `${(currentTime / baseDurationRef.current) * 100 || 0}%`,
                transition: 'width 0.1s',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#94a3b8',
            }}
          >
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(baseDurationRef.current)}</span>
          </div>
        </div>

        <button
          onClick={() => setShowSettings((prev) => !prev)}
          disabled={!isSupported}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: isSupported ? 'pointer' : 'not-allowed',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            color: '#64748b',
            flexShrink: 0,
          }}
          title="Audio settings"
        >
          <RiSettings3Line style={{ width: '16px', height: '16px' }} />
        </button>
      </div>

      {showSettings && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            padding: '10px',
            background: '#fff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
            zIndex: 1000,
            // minWidth: '240px',
            // width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <h4
              style={{
                fontSize: '12px',
                fontWeight: 600,
                margin: 0,
                color: '#1e293b',
              }}
            >
              Audio settings
            </h4>
            <button
              onClick={() => setShowSettings(false)}
              style={{
                background: 'transparent',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                color: '#64748b',
              }}
            >
              <RiCloseLine style={{ width: '14px', height: '14px' }} />
            </button>
          </div>

          {/* <div style={{ marginBottom: '8px' }}>
            <label
              style={{
                fontSize: '10px',
                fontWeight: 500,
                color: '#475569',
                display: 'block',
                marginBottom: '3px',
              }}
            >
              Voice
            </label>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = voices.find((v) => v.name === e.target.value);
                if (voice) changeVoice(voice);
              }}
              disabled={!isSupported}
              style={{
                width: '100%',
                padding: '5px 8px',
                fontSize: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                background: 'white',
              }}
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div> */}

          <div style={{ marginBottom: '8px' }}>
            <label
              style={{
                fontSize: '10px',
                fontWeight: 500,
                color: '#475569',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Speed
            </label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[0.5, 1, 1.5, 2].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSpeedChange(value)}
                  disabled={!isSupported}
                  style={{
                    padding: '4px 12px',
                    fontSize: '11px',
                    fontWeight: 500,
                    border: speed === value ? `2px solid ${themeColor}` : '1px solid #e2e8f0',
                    borderRadius: '6px',
                    background: speed === value ? '#f0fdfa' : '#fff',
                    color: speed === value ? themeColor : '#475569',
                    cursor: isSupported ? 'pointer' : 'not-allowed',
                  }}
                >
                  {value}x
                </button>
              ))}
            </div>
          </div>

          {/* <div>
            <label
              style={{
                fontSize: '10px',
                fontWeight: 500,
                color: '#475569',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Pitch
            </label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[0.5, 1, 1.5, 2].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handlePitchChange(value)}
                  disabled={!isSupported}
                  style={{
                    padding: '4px 12px',
                    fontSize: '11px',
                    fontWeight: 500,
                    border: pitch === value ? `2px solid ${themeColor}` : '1px solid #e2e8f0',
                    borderRadius: '6px',
                    background: pitch === value ? '#f0fdfa' : '#fff',
                    color: pitch === value ? themeColor : '#475569',
                    cursor: isSupported ? 'pointer' : 'not-allowed',
                  }}
                >
                  {value}x
                </button>
              ))}
            </div>
          </div> */}
        </div>
      )}

      {!isSupported && (
        <div
          style={{
            marginTop: '8px',
            fontSize: '10px',
            color: '#f97316',
            lineHeight: 1.4,
          }}
        >
          Text-to-speech is not available in this browser. Please try Chrome or
          Edge on desktop/mobile with speech enabled.
        </div>
      )}
    </div>
  );
};

export default BlogAudioWidget;