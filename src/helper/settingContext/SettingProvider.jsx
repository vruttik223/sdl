import request from '@/utils/axiosUtils';
import { SettingAPI } from '@/utils/axiosUtils/API';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useState } from 'react';
import SettingContext from '.';

const SettingProvider = (props) => {
  const [selectedCurrency, setSelectedCurrency] = useState({});
  const [settingData, setSettingData] = useState({});
  const [settingObj, setSettingObj] = useState({});
  const { data, isLoading, refetch } = useQuery({
    queryKey: [SettingAPI],
    queryFn: () => request({ url: SettingAPI }),
    enabled: false,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.values,
  });
  useEffect(() => {
    refetch();
  }, []);
  useEffect(() => {
    if (data) {
      if (data?.maintenance?.maintenance_mode) {
        Cookies.set('maintenance', JSON.stringify(true));
      } else {
        Cookies.remove('maintenance');
      }
      setSettingData(data);
      setSettingObj(data);
    }
  }, [isLoading]);

  // Convert Currency as per Exchange Rate
  const convertCurrency = useCallback((value) => {
    const symbol = '₹';
    const amount = Number(value) || 0;

    return `${symbol} ${amount.toFixed(2)}`;
  }, []);

  return (
    <SettingContext.Provider
      value={{
        ...props,
        settingData,
        convertCurrency,
        selectedCurrency,
        setSelectedCurrency,
      }}
    >
      {props.children}
    </SettingContext.Provider>
  );
};
export default SettingProvider;
