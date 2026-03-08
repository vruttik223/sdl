import { LogoutAPI } from '@/utils/axiosUtils/API';
import useCreate from '@/utils/hooks/useCreate';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { Nav, NavItem, NavLink } from 'reactstrap';
import ConfirmationModal from './ConfirmationModal';
import { useUser } from '@/utils/hooks/useUser';
import Btn from '@/elements/buttons/Btn';

const NavTabTitles = ({
  classes = {},
  activeTab,
  setActiveTab,
  titleList,
  isLogout,
  callBackFun,
}) => {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const checkType = (value, index) => {
    if (typeof activeTab == 'object') {
      return activeTab.id == value.id;
    } else {
      return activeTab == String(index + 1);
    }
  };
  const { mutate, isLoading } = useCreate(
    LogoutAPI,
    false,
    false,
    'Logout Successfully',
    () => {
      Cookies.remove('uat');
      Cookies.remove('ue');
      Cookies.remove('account');
      Cookies.remove('CookieAccept');
      localStorage.removeItem('account');
      localStorage.removeItem('role');
      router.push(`/`);
      setModal(false);
    }
  );
  const handleLogout = () => {
    mutate({});
  };

  const { userData, isUserLoading } = useUser();

  const onNavClick = (elem, i) => {
    setActiveTab((prev) => (typeof prev == 'object' ? elem : String(i + 1)));
    elem.path && router.push(`${elem.path}`);
    callBackFun && callBackFun();
  };
  return (
    <>
      <Nav className={classes?.navClass} data-lenis-prevent>
        {titleList.map((elem, i) => (
          <NavItem key={i}>
            <NavLink
              className={checkType(elem, i) ? 'active' : ''}
              onClick={() => onNavClick(elem, i)}
            >
              {elem.icon && elem.icon}
              {elem?.title || elem?.name}
              {elem?.badge ? elem?.badge : null}
            </NavLink>
          </NavItem>
        ))}
        {userData?.uid && !isUserLoading && (
          <NavItem className="logout-cls">
            <Btn color="primary" className="w-100" onClick={() => setModal(true)}>
              <RiLogoutBoxLine className="me-2 stroke-w-1" />
              Log Out
            </Btn>
          </NavItem>
        )}
      </Nav>
      <ConfirmationModal
        modal={modal}
        setModal={setModal}
        confirmFunction={handleLogout}
        isLoading={isLoading}
      />
    </>
  );
};

export default NavTabTitles;
