import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';

import { useAppContext } from '@/context/appContext';

import useLanguage from '@/locale/useLanguage';
import logoIcon from '@/style/images/logo-icon.svg';
import logoText from '@/style/images/logo-text.svg';

import useResponsive from '@/hooks/useResponsive';

import {
  SettingOutlined,
  DotChartOutlined,
  CreditCardOutlined,
  MenuOutlined,
  VideoCameraAddOutlined,
  PlayCircleOutlined, 
  FileImageOutlined 
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectLangDirection } from '@/redux/translate/selectors';

const { Sider } = Layout;

export default function Navigation() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={false} />;
}

function Sidebar({ collapsible, isMobile = false }) {
  let location = useLocation();

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const [currentPath, setCurrentPath] = useState(location.pathname.slice(1));

  const translate = useLanguage();
  const navigate = useNavigate();

  const font_style = { fontSize: '17px', color: '#08c' , paddingRight: '10px'}

  const items = [
    {
      key: 'dashboard',
      icon: <DotChartOutlined  style={font_style} />,
      label: <Link to={'/'}>{translate('dashboard')}</Link>,
    },
    {
      key: 'Images',
      icon: <FileImageOutlined style={font_style} />,
      label: <Link to={'/images'}>{translate('Images')}</Link>,
    },
    {
      key: 'Videos',
      icon: <VideoCameraAddOutlined  style={font_style}/>,
      label: <Link to={'/videos'}>{translate('Videos')}</Link>,
    },
    {
      key: 'Streaming',
      icon: <PlayCircleOutlined style={font_style}/>,
      label: <Link to={'/streaming'}>{translate('Streaming')}</Link>,
    },
    {
      key: 'payment',
      icon: <CreditCardOutlined style={font_style} />,
      label: <Link to={'/payment'}>{translate('payments')}</Link>,
    },
    {
      label: translate('Settings'),
      key: 'settings',
      icon: <SettingOutlined style={font_style}/>,
      children: [
        {
          key: 'admin',
          // icon: <TeamOutlined />,
          label: <Link to={'/admin'}>{translate('admin')}</Link>,
        },
        {
          key: 'generalSettings',
          label: <Link to={'/settings'}>{translate('settings')}</Link>,
        },
        {
          key: 'about',
          label: <Link to={'/about'}>{translate('about')}</Link>,
        },
      ],
    },
  ];

  useEffect(() => {
    if (location)
      if (currentPath !== location.pathname) {
        if (location.pathname === '/') {
          setCurrentPath('dashboard');
        } else setCurrentPath(location.pathname.slice(1));
      }
  }, [location, currentPath]);

  useEffect(() => {
    if (isNavMenuClose) {
      setLogoApp(isNavMenuClose);
    }
    const timer = setTimeout(() => {
      if (!isNavMenuClose) {
        setLogoApp(isNavMenuClose);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isNavMenuClose]);
  const onCollapse = () => {
    navMenu.collapse();
  };

  const langDirection=useSelector(selectLangDirection)
  return (
    <Sider
      collapsible={collapsible}
      collapsed={collapsible ? isNavMenuClose : collapsible}
      onCollapse={onCollapse}
      className="navigation"
      width={256}
      style={{
        overflow: 'auto',
        height: '100vh',
        direction:langDirection,
        position:isMobile?"absolute":"relative",
        bottom: '20px',
        ...(!isMobile && {
          background: 'none',
          border: 'none',
          [langDirection==="rtl"?"right":"left"]: '20px',
          top: '20px',
          borderRadius: '8px',
        }),
      }}
      theme={'light'}
    >
      <div
        className="logo"
        onClick={() => navigate('/')}
        style={{
          cursor: 'pointer',
        }}
      >
        <img src={logoIcon} alt="Logo" style={{ marginLeft: '-5px', height: '40px' }} />

        {!showLogoApp && (
          <img
            src={logoText}
            alt="Logo"
            style={{
              marginTop: '3px',
              marginLeft: '10px',
              height: '38px',
            }}
          />
        )}
      </div>

      <Menu
        items={items}
        mode="inline"
        theme={'light'}
        selectedKeys={[currentPath]}
        style={{
          paddingTop: '3.5rem',
          background: 'none',
          border: 'none',
          width: 256,
          fontSize: 17
        }}
      />
    </Sider>
  );
}

function MobileSidebar() {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const langDirection=useSelector(selectLangDirection)
  return (
    <>
      <Button
        type="text"
        size="large"
        onClick={showDrawer}
        className="mobile-sidebar-btn"

        
        style={{ [langDirection==="rtl"?"marginRight":"marginLeft"]: 25 }}
      >
        <MenuOutlined style={{ fontSize: 18 }} />
      </Button>
      <Drawer
        width={250}
        contentWrapperStyle={{
          boxShadow: 'none',
        }}
        style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}
        placement={langDirection==="rtl"?"right":"left"}

        closable={false}
        onClose={onClose}
        open={visible}

      >
        <Sidebar collapsible={false} isMobile={true} />
      </Drawer>
      
    </>
  );
}
