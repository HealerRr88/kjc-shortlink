import { Link } from 'react-router-dom';
import page_not_found_img from '../../assets/images/404-page-not-found.png'

export default function ErrorPage() {
  return (
    <div className='d-flex align-items-center' style={{ height: '100vh' }}>
      <div className="w-100 text-center">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <Link to='/' className='h5'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-bar-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5" />
          </svg>
          <span className='ms-2'>Quay lại trang chủ</span>
        </Link>
        <div className='text-center'>
          <img className='col-5 h-auto' src={page_not_found_img} alt="404" />
        </div>
      </div>
    </div>
  );
}