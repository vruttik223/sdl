import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PointAPI } from '@/utils/axiosUtils/API';
import { useQuery } from '@tanstack/react-query';
import request from '@/utils/axiosUtils';
import Loader from '@/layout/loader';
import NoDataFound from '@/components/common/NoDataFound';
import emptyImage from '../../../../public/assets/svg/empty-items.svg';
import PointTable from './PointTable';
import AccountHeading from '@/components/common/AccountHeading';

const PointTopBar = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const { data, isLoading, refetch } = useQuery({
    queryKey: [PointAPI],
    queryFn: () => request({ url: PointAPI, params: { page, paginate: 5 } }),
    enabled: false,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
  });
  useEffect(() => {
    refetch();
  }, [page]);
  if (isLoading) return <Loader />;
  return (
    <>
      <AccountHeading title="SDL Coins" />
      {data?.transactions?.data?.length > 0 ? (
        <PointTable data={data} />
      ) : (
        <NoDataFound
          data={{
            customClass: 'no-data-added',
            imageUrl: emptyImage,
            title: 'No Transaction Found',
            description: 'You have not earned any SDL Coins yet',
            height: 300,
            width: 300,
          }}
        />
      )}
    </>
  );
};

export default PointTopBar;
