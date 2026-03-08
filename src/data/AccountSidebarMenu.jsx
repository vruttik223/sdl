import {
  RiBankLine,
  RiCoinLine,
  RiFileTextLine,
  RiHomeLine,
  RiNotificationLine,
  RiWalletLine,
  RiMapPinLine,
  RiRefund2Line,
} from 'react-icons/ri';

export const sidebarMenu = [
  {
    title: 'My Profile',
    icon: <RiHomeLine />,
    id: 'dashboard',
    path: '/account/my-profile',
  },
  // {
  //   title: 'Notification',
  //   icon: <RiNotificationLine />,
  //   id: 'notification',
  //   path: '/account/notification',
  //   badge: <span className="notification-count">1</span>,
  // },
  // {
  //   title: 'Bank Details',
  //   icon: <RiBankLine />,
  //   id: 'bank-details',
  //   path: '/account/bank-details',
  // },
  // {
  //   title: 'My Wallet',
  //   icon: <RiWalletLine />,
  //   id: 'wallet',
  //   path: '/account/wallet',
  // },
  {
    title: 'SDL Coins',
    icon: <RiCoinLine />,
    id: 'coins',
    path: '/account/coins',
  },
  {
    title: 'My Orders',
    icon: <RiFileTextLine />,
    id: 'order',
    path: '/account/order',
  },
  // {
  //   title: 'Refund History',
  //   icon: <RiRefund2Line />,
  //   id: 'refund',
  //   path: '/account/refund',
  // },
  {
    title: 'Saved Address',
    icon: <RiMapPinLine />,
    id: 'address',
    path: '/account/addresses',
  },
];
