'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from 'reactstrap';
import {
  RiMapPinLine,
  RiTimeLine,
  RiUser3Line,
  RiCalendarScheduleLine,
} from 'react-icons/ri';
import { FiClock } from 'react-icons/fi';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { format } from 'date-fns';

const EventScheduleSection = ({ eventData }) => {
  const [calendarOpenIndex, setCalendarOpenIndex] = useState(null);
  const [iframeModalOpen, setIframeModalOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const calendarDropdownRef = useRef(null);

  const scheduleItems = eventData?.variants || [];

  const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    return `${startTime} - ${endTime}`;
  };

  const formatFullDateRange = (startDate, endDate) => {
    if (!startDate) return '';
    const formattedStart = format(new Date(startDate), 'MMM dd, yyyy');
    if (!endDate || endDate === startDate) return formattedStart;
    const formattedEnd = format(new Date(endDate), 'MMM dd, yyyy');
    return `${formattedStart} - ${formattedEnd}`;
  };

  const getAddress = (variant) => {
    // if (variant?.googleAddress) {
    //   return variant.googleAddress;
    // }

    const line1 = variant?.addressLine1;
    const line2 = variant?.addressLine2;
    const city = variant?.city;
    const state = variant?.state;
    const pincode = variant?.pincode;

    const parts = [];

    if (line1) parts.push(line1);
    if (line2) parts.push(line2);
    if (city) parts.push(city);

    if (state && pincode) {
      parts.push(`${state} - ${pincode}`);
    } else if (state) {
      parts.push(state);
    } else if (pincode) {
      parts.push(pincode);
    }

    return parts.join(', ');
  };

  const getStatus = (variant) => {
    if (variant?.isUpcoming)
      return { text: 'Upcoming', className: 'badge-upcoming' };
    if (variant?.isPast) return { text: 'Past Event', className: 'badge-past' };
    return { text: '', className: '' };
  };

  // Close calendar dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        calendarDropdownRef.current &&
        !calendarDropdownRef.current.contains(e.target)
      ) {
        setCalendarOpenIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close iframe modal on Escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && iframeModalOpen) {
        closeIframeModal();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [iframeModalOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (iframeModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [iframeModalOpen]);

  // Format date+time for calendar URLs: YYYYMMDD or YYYYMMDDTHHMMSS
  const formatCalendarDateTime = (dateStr, timeStr, useTime = true) => {
    if (!dateStr) return '';
    const datePart = dateStr.replace(/-/g, ''); // 20260128
    if (!useTime || !timeStr) return datePart;
    const timePart = timeStr.replace(/:/g, '').padEnd(6, '0'); // 140000 from 14:00
    return `${datePart}T${timePart}`;
  };

  const getEventForCalendar = (variant) => {
    const start = formatCalendarDateTime(
      variant?.startDate,
      variant?.startTime ?? '00:00',
      true
    );
    const end = formatCalendarDateTime(
      variant?.endDate || variant?.startDate,
      variant?.endTime ?? variant?.startTime ?? '23:59',
      true
    );
    return {
      title: eventData?.event?.title ?? '',
      shortDescription: eventData?.event?.shortDescription ?? '',
      location:
        getAddress(variant) ||
        (variant?.type === 'Online' ? variant?.link || 'Virtual Event' : ''),
      start,
      end,
      // ISO format for Outlook
      startISO:
        variant?.startDate && variant?.startTime
          ? `${variant.startDate}T${variant.startTime}:00`
          : variant?.startDate
            ? `${variant.startDate}T00:00:00`
            : '',
      endISO:
        (variant?.endDate || variant?.startDate) &&
        (variant?.endTime || variant?.startTime)
          ? `${variant.endDate || variant.startDate}T${variant.endTime || variant.startTime}:00`
          : variant?.endDate || variant?.startDate
            ? `${variant.endDate || variant.startDate}T23:59:59`
            : '',
    };
  };

  const googleUrl = (variant) => {
    const event = getEventForCalendar(variant);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${event.start}/${event.end}&details=${encodeURIComponent(
      event.shortDescription
    )}&location=${encodeURIComponent(event.location)}`;
  };

  const outlookUrl = (variant) => {
    const event = getEventForCalendar(variant);
    return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
      event.title
    )}&body=${encodeURIComponent(
      event.shortDescription
    )}&location=${encodeURIComponent(
      event.location
    )}&startdt=${encodeURIComponent(event.startISO)}&enddt=${encodeURIComponent(event.endISO)}`;
  };

  const yahooUrl = (variant) => {
    const event = getEventForCalendar(variant);
    return `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(
      event.title
    )}&st=${event.start}&et=${event.end}&desc=${encodeURIComponent(
      event.shortDescription
    )}&in_loc=${encodeURIComponent(event.location)}`;
  };

  const downloadICS = (variant) => {
    const event = getEventForCalendar(variant);
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title.replace(/\n/g, '\\n')}
DESCRIPTION:${event.shortDescription.replace(/\n/g, '\\n')}
LOCATION:${event.location.replace(/\n/g, '\\n')}
DTSTART:${event.start}
DTEND:${event.end}
END:VEVENT
END:VCALENDAR`.trim();

    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'event.ics';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCalendarSelect = (type, variant) => {
    setCalendarOpenIndex(null);
    if (type === 'ical') downloadICS(variant);
    else if (type === 'google') window.open(googleUrl(variant), '_blank');
    else if (type === 'outlook') window.open(outlookUrl(variant), '_blank');
    else if (type === 'yahoo') window.open(yahooUrl(variant), '_blank');
  };

  const normalizeEmbedUrl = (url) => {
    if (!url) return url;

    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase().replace('www.', '');

      // YouTube
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        let videoId = '';
        if (hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.split('/')[1];
        } else if (urlObj.searchParams.has('v')) {
          videoId = urlObj.searchParams.get('v');
        } else if (urlObj.pathname.includes('/embed/')) {
          return url; // Already in embed format
        }
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
        }
      }

      // Vimeo
      if (hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/').filter(Boolean).pop();
        if (videoId && !urlObj.pathname.includes('/video/')) {
          return `https://player.vimeo.com/video/${videoId}`;
        }
        if (urlObj.pathname.includes('/video/')) {
          return url; // Already in embed format
        }
      }

      // Twitch
      if (hostname.includes('twitch.tv')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          const channel = pathParts[0];
          const parentDomain =
            typeof window !== 'undefined'
              ? window.location.hostname
              : 'localhost';
          // Check if it's a video or channel
          if (pathParts[0] === 'videos' && pathParts[1]) {
            return `https://player.twitch.tv/?video=${pathParts[1]}&parent=${parentDomain}`;
          } else {
            return `https://player.twitch.tv/?channel=${channel}&parent=${parentDomain}`;
          }
        }
      }

      // Zoom - Note: Zoom doesn't support iframe embedding for security reasons
      // We'll keep the original URL and it will open in the iframe
      if (hostname.includes('zoom.us') || hostname.includes('zoom.com')) {
        return url; // Return as is - user will need to click through
      }

      // Google Meet - Note: Google Meet doesn't support iframe embedding
      // We'll keep the original URL
      if (hostname.includes('meet.google.com')) {
        return url; // Return as is - user will need to click through
      }

      // Microsoft Teams - Limited embed support
      if (
        hostname.includes('teams.microsoft.com') ||
        hostname.includes('teams.live.com')
      ) {
        return url; // Return as is
      }

      // Dailymotion
      if (hostname.includes('dailymotion.com') || hostname.includes('dai.ly')) {
        const videoId = urlObj.pathname.split('/').filter(Boolean).pop();
        if (videoId) {
          return `https://www.dailymotion.com/embed/video/${videoId}`;
        }
      }

      // Facebook Video
      if (hostname.includes('facebook.com') || hostname.includes('fb.watch')) {
        // Facebook videos have complex URLs, attempt to preserve
        return url;
      }

      // Default: return original URL
      return url;
    } catch (error) {
      console.error('Error normalizing URL:', error);
      return url; // Return original URL if parsing fails
    }
  };

  const openIframeModal = (url) => {
    const normalizedUrl = normalizeEmbedUrl(url);
    setIframeUrl(normalizedUrl);
    setIframeModalOpen(true);
  };

  const closeIframeModal = () => {
    setIframeModalOpen(false);
    setIframeUrl('');
  };

  if (!scheduleItems.length)
    return (
      <>
        <section className="event-schedule-section">
          <div className="event-section-card">
            <div className="event-section-header">
              <span className="event-section-indicator" />
              <h2 className="section-title">
                <span className="icon">
                  <FiClock />
                </span>{' '}
                Event Schedule
              </h2>
            </div>
            <div className="schedule-list">
              <p>No schedule available for this event.</p>
            </div>
          </div>
        </section>
      </>
    );

  return (
    <section className="event-schedule-section">
      <div className="event-section-card">
        <div className="event-section-header">
          <span className="event-section-indicator" />
          <h2 className="section-title">
            <span className="icon">
              <FiClock />
            </span>{' '}
            Event Schedule
          </h2>
        </div>

        <div className="schedule-list">
          {scheduleItems.map((variant, index) => {
            const typeValue = (variant?.type || '').toString();
            const typeLower = typeValue.toLowerCase();
            const startDate = variant?.startDate;
            const endDate = variant?.endDate;
            const startTime = variant?.displayStartTime || variant?.startTime;
            const endTime = variant?.displayEndTime || variant?.endTime;
            const status = getStatus(variant);
            const address = getAddress(variant);

            const dateRange = formatFullDateRange(startDate, endDate);
            const timeRange = formatTimeRange(startTime, endTime);

            return (
              <div key={variant.uid || index} className="schedule-item">
                <div className="schedule-date-badge">
                  <div className="date-full">
                    {startDate ? new Date(startDate).getDate() : ''}
                    <small className="d-block">
                      {startDate ? format(new Date(startDate), 'MMM') : ''}
                    </small>
                  </div>
                </div>

                <div className="schedule-content">
                  <div className="schedule-header">
                    <h3 className="schedule-title">
                      {eventData?.event?.title}
                    </h3>
                    <div className="d-flex align-items-center gap-2">
                      {status.text && (
                        <span className={`schedule-badge ${status.className}`}>
                          {status.text}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="schedule-details">
                    <div className="schedule-detail-item">
                      <RiTimeLine className="detail-icon" />
                      <span>{timeRange}</span>
                    </div>

                    {typeLower === 'online' ? (
                      <div className="schedule-detail-item">
                        <RiMapPinLine className="detail-icon" />
                        <span>Virtual Event - Accessible Worldwide</span>
                        {variant?.link && (
                          <button
                            onClick={() => openIframeModal(variant.link)}
                            className="schedule-link ms-2"
                            type="button"
                          >
                            Join Event
                          </button>
                        )}
                      </div>
                    ) : (
                      address && (
                        <div className="schedule-detail-item">
                          <RiMapPinLine className="detail-icon" />
                          <span>{address}</span>
                        </div>
                      )
                    )}

                    {variant?.organizer && (
                      <div className="schedule-detail-item">
                        <RiUser3Line className="detail-icon" />
                        <span>Organized by {variant.organizer}</span>
                      </div>
                    )}
                  </div>

                  <div className="schedule-actions">
                    {typeLower === 'offline' &&
                      (variant?.latitude || variant?.placeId) && (
                        <Button
                          className="btn-directions btn-secondary"
                          size="sm"
                          outline
                          onClick={() => {
                            const { latitude, longitude, placeId } = variant;
                            if (!latitude || !longitude) {
                              alert('Location coordinates not available');
                              return;
                            }
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

                            window.open(url, '_blank', 'noreferrer');
                          }}
                        >
                          Get Directions{' '}
                          <HiOutlineArrowNarrowRight className="ms-1" />
                        </Button>
                      )}

                    {variant?.isUpcoming && (
                      <div
                        className="calendar-dropdown-wrapper"
                        ref={calendarDropdownRef}
                      >
                        <button
                          className="sidebar-action-btn calendar btn-primary"
                          type="button"
                          onClick={() =>
                            setCalendarOpenIndex(
                              calendarOpenIndex === index ? null : index
                            )
                          }
                        >
                          <RiCalendarScheduleLine className="me-1" />
                          Add To Calendar
                        </button>

                        {calendarOpenIndex === index && (
                          <ul className="sidebar-calendar-dropdown">
                            <li
                              onClick={() =>
                                handleCalendarSelect('google', variant)
                              }
                            >
                              Google Calendar
                            </li>
                            <li
                              onClick={() =>
                                handleCalendarSelect('yahoo', variant)
                              }
                            >
                              Yahoo
                            </li>
                            <li
                              onClick={() =>
                                handleCalendarSelect('outlook', variant)
                              }
                            >
                              Outlook
                            </li>
                            <li
                              onClick={() =>
                                handleCalendarSelect('ical', variant)
                              }
                            >
                              iCal
                            </li>
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Iframe Modal */}
      {iframeModalOpen && (
        <div className="iframe-modal-overlay" onClick={closeIframeModal}>
          <div
            className="iframe-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="iframe-modal-close"
              onClick={(e) => {
                e.stopPropagation();
                closeIframeModal();
              }}
              type="button"
              aria-label="Close"
            >
              ×
            </button>
            <div className="iframe-wrapper">
              <iframe
                src={iframeUrl}
                title="Event Link"
                className="event-iframe"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone; camera"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventScheduleSection;
