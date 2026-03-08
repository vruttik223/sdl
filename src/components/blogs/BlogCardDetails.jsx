'use client';
import React, { useContext } from 'react';
import { Col } from 'reactstrap';
import Link from 'next/link';
import RatioImage from '@/utils/RatioImage';
import BlogImageDetails from './BlogImageDetails';
import BlogAudioWidget from './BlogAudioWidget';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import { placeHolderImage } from '../../data/CommonPath';
import { useTranslation } from '@/utils/translations';
import { useSearchParams } from 'next/navigation';
import { RiCalendarLine, RiPlayCircleFill } from 'react-icons/ri';
import { dateFormat } from '@/utils/customFunctions/DateFormat';
import BlogDesclaimer from './BlogDesclaimer';

// Extract YouTube video ID from various URL formats (same as EventVideosSection)
const extractYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?\s]+)/,
    /youtube\.com\/embed\/([^&\?\s]+)/,
    /youtube\.com\/shorts\/([^&\?\s]+)/,
    /youtube\.com\/v\/([^&\?\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
};

const getYouTubeEmbedUrl = (videoId) =>
  `https://www.youtube.com/embed/${videoId}?autoplay=1`;
const getYouTubeThumbnail = (videoId) =>
  `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

const BlogCardDetails = ({ Blog, sidebarType, categorySlug, rawBlog, onVideoSelect }) => {
  const { themeOption } = useContext(ThemeOptionContext);
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const querySidebar = searchParams?.get('sidebar');
  const sidebarVariant =
    sidebarType ||
    querySidebar ||
    themeOption?.blog?.blog_sidebar_type ||
    'right_sidebar';
  const styleObj = {
    no_sidebar: { colClass: { xxl: 12, xl: 12, lg: 12 } },
    left_sidebar: { class: 'order-lg-2', colClass: { xxl: 9, xl: 8, lg: 7 } },
    right_sidebar: { colClass: { xxl: 9, xl: 8, lg: 7 } },
  };

  const mediaContainerStyle = {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #e0e0e0',
    // backgroundColor: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const keywordsArray = (Blog?.keywords || Blog?.raw_keywords || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  const authorName = Blog?.created_by?.name || '';
  return (
    <>
      {/* Full-width image row */}
      <Col xxl="12" xl="12" lg="12" className="ratio_50">
        <div className="blog-detail-image rounded-3 mb-4">
          {(() => {
            const bannerSrc =
              Blog?.banner_image ||
              Blog?.blog_thumbnail?.original_url ||
              '';
            if (!bannerSrc) return null;
            return (
              <RatioImage
                src={bannerSrc || placeHolderImage}
                className="bg-img"
                alt=""
              />
            );
          })()}
          {/* <BlogImageDetails Blog={Blog} /> */}
        </div>
        <div className="blog-image-contain text-center">
          <BlogImageDetails Blog={Blog} />
        </div>
      </Col>

      {/* Content and tags follow layout based on sidebar */}
      <Col
        {...styleObj[sidebarVariant]?.colClass}
        className={`${styleObj[sidebarVariant]?.class || ''}`}
      >
        <div className="blog-image-contain pb-3">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              color: '#777',
            }}
          >
            <ul
              className="contain-comment-list"
              style={{ marginBottom: 0, display: 'flex', gap: '16px', flexWrap: 'wrap' }}
            >
              {themeOption?.blog?.blog_author_enable && authorName && (
                <li>
                  <div className="user-list" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      {Blog?.created_by?.image ? (
                        <img
                          src={Blog.created_by.image}
                          alt={authorName}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#e9ecef',
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#495057',
                            textTransform: 'capitalize'
                            
                          }}
                          aria-hidden
                        >
                          {authorName}
                        </span>
                      )}
                    </div>
                    <span style={{ color: '#000' }}>{Blog?.created_by?.name}</span>
                  </div>
                </li>
              )}

              <li>
                <div className="user-list" style={{ display: 'flex', alignItems: 'center', gap: '6px',  marginTop: '4px' }}>
                  <RiCalendarLine />
                  <span style={{ color: '#000' }}> {dateFormat(Blog?.created_at)}</span>
                </div>
              </li>
            </ul>

            <div className='audio-wrapper'>
              <BlogAudioWidget
                title={Blog?.title}
                subtitle={Blog?.seo_title || Blog?.sub_title}
                content={Blog?.content}
              />
            </div>

            <style jsx>{`
  .audio-wrapper {
    display: flex;
  }

  @media (max-width: 576px) {
    .audio-wrapper {
      flex: 1 1 100%;
      width: 100%;
    }
  }
`}</style>

          </div>
        </div>
        <div className="blog-detail-contain" style={{ textAlign: 'justify' }}>
          <p
            dangerouslySetInnerHTML={{ __html: Blog?.content }}
          />
        </div>
        {/* Blog media (images / videos) shown above keywords */}
        {(() => {
          const medias =
            Blog?.blog_medias ||
            Blog?.blogMedias ||
            rawBlog?.blogMedias ||
            rawBlog?.blog_medias ||
            [];
          if (!medias?.length) return null;
          return (
            <div className="blog-media-sec mb-3">
              {medias.map((media, index) => {
                if (media?.type === 'image' && media?.path) {
                  return (
                    <div key={media.uid || index} className="mb-3">
                      <div style={mediaContainerStyle}>
                        <img
                          src={media.path}
                          alt={Blog?.coverImageAlt || Blog?.cover_image_alt || ''}
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    </div>
                  );
                }

                // Video: same format as EventVideosSection — thumbnail card, click opens modal (no new tab)
                if (media?.type === 'video' && media?.videoUrl) {
                  const videoId = extractYouTubeId(media.videoUrl);
                  const videoItem = {
                    videoId,
                    title: media.title || Blog?.title || 'Video',
                    thumbnail: media.path || (videoId ? getYouTubeThumbnail(videoId) : null),
                  };
                  return (
                    <div
                      key={media.uid || index}
                      className="event-videos-section mb-3"
                      style={{ padding: 0, background: 'transparent' }}
                    >
                      <div
                        className="video-card"
                        onClick={() => videoId && onVideoSelect && onVideoSelect(videoItem)}
                        style={{ cursor: videoId ? 'pointer' : 'default' }}
                      >
                        <div className="video-thumbnail-wrapper">
                          <img
                            src={videoItem.thumbnail || placeHolderImage}
                            alt={videoItem.title}
                            className="video-thumbnail"
                          />
                          {videoId && (
                            <div className="video-play-overlay">
                              <RiPlayCircleFill className="play-icon" />
                            </div>
                          )}
                        </div>
                        {/* {videoItem.title && (
                          <div className="video-info">
                            <h4 className="video-title">{videoItem.title}</h4>
                          </div>
                        )} */}
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          );
        })()}
        {keywordsArray.length > 0 && (
          <div className="tags-sec my-4">
            <h5>{t('Keywords')}:</h5>
            <ul className="contain-list">
              {keywordsArray.map((keyword, i) => (
                <li key={i}>
                  <Link href={`/blogs?keyword=${encodeURIComponent(keyword)}`}>
                    {keyword}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="blog-desclaimer">
          <BlogDesclaimer />
        </div>
      </Col>

      {/* Video modal — rendered outside Col to avoid overflow/z-index issues, plays in-page (no new tab) */}
      {/* {selectedVideo?.videoId && (
        <div
          className="video-modal"
          onClick={() => setSelectedVideo(null)}
          style={{ zIndex: 10000 }}
        >
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="video-modal-close"
              onClick={() => setSelectedVideo(null)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '-50px',
                right: '0',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '48px',
                cursor: 'pointer',
                width: '48px',
                height: '48px',
                lineHeight: '1',
                padding: '0',
                zIndex: 10001,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
            <div className="video-wrapper">
              <iframe
                src={getYouTubeEmbedUrl(selectedVideo.videoId)}
                title={selectedVideo.title}
                // frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-iframe"
              />
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default BlogCardDetails;
