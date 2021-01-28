import React, { useContext } from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import ActivityStore from '../../app/stores/activityStore'
import { observer } from 'mobx-react-lite';

const NavBar: React.FC = () => {
  const activityStore = useContext(ActivityStore)
  return (
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header>
            <img src="/assets/images/logo.png" alt="logo" style={{marginRight: "10px"}} />
            Reactivities
          </Menu.Item>
          <Menu.Item name='Activities' />
          <Menu.Item>
            <Button onClick={activityStore.openCreateForm} positive content="Create Activity" />
          </Menu.Item>
        </Container>
      </Menu>
  );
};

export default observer(NavBar);
