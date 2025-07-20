import { login } from "../../services/user";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { RR88_SHORTLINK_USER, TOKEN_NAME } from "../../utilities/constants";
import { setAuthorization } from "../../services/axios_client";
import logo from '../../assets/images/logo.webp';
import styles from "./style.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const onSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    if (!username) {
      event.target.username.classList.add('border-danger');
    }
    if (!password) {
      event.target.password.classList.add('border-danger');
    }

    if (username && password) {
      const data = {
        username,
        password,
      }
      try {
        const response = await login(data);
        if (response.statusCode === 200) {
          localStorage.setItem(TOKEN_NAME, response.data.token);
          localStorage.setItem(RR88_SHORTLINK_USER, JSON.stringify(response.data.user));
          setAuthorization(response.data.token);
          navigate(state?.path || "/");
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message);
      }
    }
    else {
      toast.error('Hãy nhập đầy đủ thông tin!');
    }
  }

  return (
    <div className={"d-flex justify-content-center align-items-center " + styles.login}>
      <div className="col-5 pt-4 pb-3" style={{ maxWidth: '500px', borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
        <div className="text-center">
          <img className="col-7" src={logo} alt="logo" />
        </div>
        <form className="col-10 m-auto text-start mt-4" onSubmit={onSubmit}>
          <div>
            <label className="text-dark fw-medium">Tên tài khoản:</label>
            <input name="username" className="form-control form-control-lg" type="text" placeholder="Nhập tên tài khoản" autoFocus />
          </div>
          <div className="mt-3">
            <label className="text-dark fw-medium">Mật khẩu:</label>
            <input name="password" className="form-control form-control-lg" type="password" placeholder="Nhập mật khẩu" minLength={6} />
          </div>
          <div className="text-center mt-3">
            <button className="btn btn-primary btn-lg mt-4 fw-bold h2">ĐĂNG NHẬP</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage;