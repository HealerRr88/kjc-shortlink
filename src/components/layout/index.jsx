import { Outlet } from 'react-router-dom';
import logo from '../../assets/images/Logo-KJC.png'
import Menu from '../menu';
import { RR88_SHORTLINK_USER } from '../../utilities/constants';

export default function Layout() {
  const logedInUser = JSON.parse(localStorage.getItem(RR88_SHORTLINK_USER));

  return (
    <div className={'d-flex'}>
      <div className='flex-fill' style={{ minWidth: 280, maxWidth: 300 }}>
        <div className='col-8 mx-auto my-4'>
          <a href="/">
            <img className='w-100' src={logo} alt="logo" />
          </a>
        </div>
        <Menu logedInUser={logedInUser} />
      </div>
      <div className='flex-fill p-3 position-relative'>
        <Outlet context={logedInUser} />
      </div>
    </div>
  )
}