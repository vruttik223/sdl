import Image from 'next/image';

const Avatar = ({
  data,
  placeHolder,
  name,
  customClass,
  customImageClass,
  height,
  width,
}) => {
  return (
    <>
      {data?.original_url ? (
        // <div className={`${customClass ? customClass : ''}`}>
          <Image
            className={customImageClass ? customImageClass : ''}
            src={data?.original_url}
            height={height || 50}
            width={width || 50}
            alt={name?.name || name || ''}
            unoptimized
          />
        // </div>
      ) : placeHolder ? (
        <div className={`${customClass ? customClass : ''}`}>
          <Image
            className={customImageClass ? customImageClass : ''}
            src={placeHolder}
            height={height || 50}
            width={width || 50}
            alt={name?.name || name || ''}
            unoptimized
          />
        </div>
      ) : (
        <h1>
          {name?.name?.charAt(0).toString().toUpperCase() ||
            // `${name.split(' ')[0]?.charAt(0)?.toString()?.toUpperCase()}${name.split(' ')[1]?.charAt(0)?.toString()?.toUpperCase()}` || ''}
            `${name.split(' ')[0]?.charAt(0)?.toString()?.toUpperCase()}` || ''}
        </h1>
      )}
    </>
  );
};

export default Avatar;
