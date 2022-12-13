import { Badge, NavBar, NoticeBar, TabBar } from "antd-mobile";
import {
  AppOutline,
  BellOutline,
  CloseCircleOutline,
  CompassOutline,
  MessageOutline,
  SetOutline,
  UnorderedListOutline,
  UserOutline,
} from "antd-mobile-icons";
import { TabBarItem } from "antd-mobile/es/components/tab-bar/tab-bar";
import { getMessaging, MessagePayload, onMessage } from "firebase/messaging";
import React, { FC, useState } from "react";
import { Outlet, Router, useLocation, useNavigate } from "react-router";
interface BottomProps {
  isHasUnReadNotification?: boolean;
}
const Bottom = (props: BottomProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const setRouteActive = (value: string) => {
    navigate(value);
  };

  return (
    <TabBar activeKey={pathname} onChange={(value) => setRouteActive(value)}>
      <TabBarItem title="Dashboard" key="/" icon={<AppOutline />} />
      <TabBarItem title="Food" key="/foods" icon={<UnorderedListOutline />} />
      <TabBarItem
        title="Notifications"
        key="/notifications"
        icon={<BellOutline />}
        badge={props.isHasUnReadNotification ? Badge.dot : null}
      />
      <TabBarItem title="Settings" key="/settings" icon={<SetOutline />} />
    </TabBar>
  );
};

function MainLayout() {
  const [notification, setNotification] = useState<MessagePayload | null>(null);
  /**
   * BEGIN process FCM received
   */
  //   const messaging = getMessaging();
  //   onMessage(messaging, (payload) => {
  //     console.log("Message received. ", payload);
  //     setNotification(payload);
  //   });

  /**
   * END process FCM received
   */
  return (
    <div className="app">
      <div className="top">
        {notification ? (
          <NoticeBar
            content={
              notification.notification?.title +
              " - " +
              notification.notification?.body
            }
            closeable={true}
            onClose={() => setNotification(null)}
          />
        ) : null}
      </div>
      <div className="body">
        <Outlet />
      </div>
      <div className="bottom">
        <Bottom isHasUnReadNotification={true} />
      </div>
    </div>
  );
}

export default MainLayout;
