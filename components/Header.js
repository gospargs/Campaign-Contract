import React from 'react';
import { Menu } from 'semantic-ui-react';
import {Link} from '../routes';
// Link - react component that allows us to render ancor tags into our react components and navigate arround the app

const HeaderComponent = (props) => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link route='/'>
          <a className='item'>
              CrowdCoin
          </a>
      </Link>
      <Menu.Menu position='right'>
      <Link route='/'>
          <a className='item'>
              Campaigns
          </a>
      </Link>
      <Link route='/campaigns/new'>
          <a className='item'>
              +
          </a>
      </Link>
      </Menu.Menu>
    </Menu>
  );
};
export default HeaderComponent;
