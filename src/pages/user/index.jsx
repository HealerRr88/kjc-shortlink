import { useState } from "react"
import { createUser, getPagingUsers, removeUser, updateUser } from "../../services/user"
import PageLoading from "../../components/loading/page";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Link, useOutletContext } from "react-router-dom";
import { Accordion, Modal, OverlayTrigger, Popover } from "react-bootstrap";
import { getAll } from "../../services/role";
import default_avatar from '../../assets/images/default_avatar.webp';
import moment from "moment";
import PaginationComp from "../../components/pagination";
import './styles.css';
import styles from './style.module.css';

const USERS_KEY = 'users';
const ALL_ROLES_KEY = 'all-roles';

export default function UserPage() {
  const logedInUser = useOutletContext();
  const queryClient = useQueryClient();
  const [pagingObj, setPagingObj] = useState({
    pageIndex: 1,
    pageSize: 20,
    username: null,
    fullname: null,
    displayName: null,
    email: null,
    phoneNumber: null,
    status: null
  });
  const [isShowCreateUserModal, setIsShowCreateUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const usersData = useQuery(
    [USERS_KEY, pagingObj],
    () => getPagingUsers(pagingObj),
    { refetchOnWindowFocus: false }
  );

  const roleData = useQuery(
    [ALL_ROLES_KEY],
    () => getAll(),
    { refetchOnWindowFocus: false }
  );

  const createUserMutation = useMutation(createUser, {
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries(USERS_KEY);
      setIsShowCreateUserModal(false);
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  const udpateUserMutation = useMutation(updateUser, {
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries(USERS_KEY);
      setEditingUser(null);
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  const deleteUserMutation = useMutation(removeUser, {
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries(USERS_KEY);
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  if (!logedInUser || logedInUser.role.rolename !== 'Admin') {
    return (
      <div className="text-center mt-5">
        Bạn không có quyền truy cập trang này!
      </div>
    )
  }

  if (usersData.isLoading || roleData.isLoading) {
    return <PageLoading />
  }

  if (usersData.isError || roleData.isError) {
    toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    return;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 0:
        return `<span class="text-danger"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-file-lock" viewBox="0 0 16 16">
                  <path d="M8 5a1 1 0 0 1 1 1v1H7V6a1 1 0 0 1 1-1m2 2.076V6a2 2 0 1 0-4 0v1.076c-.54.166-1 .597-1 1.224v2.4c0 .816.781 1.3 1.5 1.3h3c.719 0 1.5-.484 1.5-1.3V8.3c0-.627-.46-1.058-1-1.224M6.105 8.125A.64.64 0 0 1 6.5 8h3a.64.64 0 0 1 .395.125c.085.068.105.133.105.175v2.4c0 .042-.02.107-.105.175A.64.64 0 0 1 9.5 11h-3a.64.64 0 0 1-.395-.125C6.02 10.807 6 10.742 6 10.7V8.3c0-.042.02-.107.105-.175"/>
                  <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
                </svg></span>`;
      case 1:
        return `<span class="text-success"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-play-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
                </svg></span>`
      default:
        break;
    }
  }

  const addNewUser = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    const role = event.target.role.value;
    const fullname = event.target.fullname.value;

    if (username && password && role) {
      let data = {
        username,
        password,
        role,
        fullname,
      };
      createUserMutation.mutate(data);
    }
    else {
      toast.warning('Vui lòng nhập các thông tin bắt buộc!');
    }
  }

  const editUser = async (event) => {
    event.preventDefault();
    const password = event.target.password.value;
    const role = event.target.role.value;
    const fullname = event.target.fullname.value;
    const status = event.target.status.value;

    let data = { _id: editingUser._id };
    if (password) {
      data = { ...data, password };
    }
    if (role) {
      data = { ...data, role };
    }
    if (fullname) {
      data = { ...data, fullname };
    }
    if (status) {
      data = { ...data, status: parseInt(status) };
    }
    udpateUserMutation.mutate(data);
  }

  const deleteUser = (id) => {
    const oke = window.confirm('Bạn có chắc chắn muốn xóa?');
    if (oke) {
      deleteUserMutation.mutate(id);
    }
  }

  const search = (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const fullname = event.target.fullname.value;
    const status = event.target.status.value;

    setPagingObj(old => {
      return {
        ...old,
        username,
        fullname,
        status
      }
    });
  }

  const isAccordionOpen = (pagingObj) => {
    if (pagingObj.username || pagingObj.fullname || pagingObj.status) {
      return 0;
    }
    else {
      return -1;
    }
  }

  return (
    <>
      <h1 className="h5 border-start border-4 ps-2 border-dark bg-light py-2 fw-bold">Quản lý tài khoản</h1>

      <div className="d-flex justify-content-between align-items-end my-3">
        <Accordion defaultActiveKey={isAccordionOpen(pagingObj)}>
          <Accordion.Item eventKey={0} className="border-0">
            <Accordion.Header>
              <span className="pe-3">Bọ lọc tìm kiếm</span>
            </Accordion.Header>
            <Accordion.Body>
              <form className="d-flex flex-wrap align-items-end gap-2" onSubmit={(event) => { search(event) }}>
                <div>
                  <label className="fw-medium small">Tên tài khoản</label>
                  <input type="text" name="username" className="form-control form-control-sm" placeholder="Tên tài khoản" defaultValue={pagingObj?.username} />
                </div>
                <div>
                  <label className="fw-medium small">Tên</label>
                  <input type="text" name="fullname" className="form-control form-control-sm" placeholder="Tên" defaultValue={pagingObj?.fullname} />
                </div>
                <div>
                  <label className="fw-medium small">Trạng thái</label>
                  <select className="form-select form-select-sm" name="status" defaultValue={pagingObj?.status}>
                    <option value="">Tất cả</option>
                    <option value="1">Đang hoạt động</option>
                    <option value="0">Đã bị khóa</option>
                  </select>
                </div>
                <button className="btn btn-sm btn-secondary">Tìm kiếm</button>
              </form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <button className="btn btn-primary d-flex justify-content-center align-items-center" style={{ minWidth: 115 }} onClick={() => { setIsShowCreateUserModal(true) }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-plus" viewBox="0 0 16 16">
            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
            <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5" />
          </svg>
          <span className="ms-2">Tạo mới</span>
        </button>
      </div>
      <div className="d-flex flex-wrap small mb-4">
        {
          usersData.data.data.length > 0 && usersData.data.data.map(item => (
            <div key={item._id} className={`p-2 ${styles.user}`}>
              <div className="text-center">
                <img className={styles.avatar} src={default_avatar} alt="avatar" />
              </div>
              <div className="bg-light px-2 pt-2 pb-3 rounded d-flex flex-column gap-2 mt-1">
                <div className="d-flex justify-content-between">
                  <div className="fw-bold">Tài khoản: </div>
                  <div>{item.username}</div>
                </div>
                <div className="d-flex justify-content-between">
                  <div className="fw-bold">Vai trò: </div>
                  <div>{item.role?.rolename}</div>
                </div>
                <div className="d-flex justify-content-between">
                  <div className="fw-bold">Trạng thái: </div>
                  <div dangerouslySetInnerHTML={{ __html: getStatusIcon(item.status) }}></div>
                </div>
                <OverlayTrigger
                  trigger="click"
                  key={item._id}
                  placement={'bottom'}
                  rootClose
                  overlay={
                    <Popover id={item._id}>
                      <Popover.Body className="d-flex flex-column gap-2">
                        <div className="d-flex justify-content-between">
                          <div className="fw-bold">Tên: </div>
                          <div>{item.fullname}</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="fw-bold">Thời gian: </div>
                          <div>{moment(item.createdTime).format('HH:mm DD/MM/YYYY')}</div>
                        </div>
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <div className="text-center cursor-pointer">Xem thêm</div>
                </OverlayTrigger>

              </div>
              <div className="d-flex justify-content-center">
                <Link className="flex-fill bg-danger text-white text-center py-1" title="Xóa" onClick={() => { deleteUser(item._id) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                  </svg>
                </Link>
                <Link className="flex-fill bg-primary text-white text-center py-1" title="Sửa" onClick={() => { setEditingUser(item) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                  </svg>
                </Link>
              </div>
            </div>
          ))
        }

      </div>

      <PaginationComp
        pageIndex={usersData.data.pageIndex}
        pageSize={usersData.data.pageSize}
        totalPage={usersData.data.totalPage}
        setPagingObj={setPagingObj}
      />

      <Modal
        show={isShowCreateUserModal}
        onHide={() => { setIsShowCreateUserModal(false) }}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">Tạo tài khoản mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="d-flex flex-wrap justify-content-around align-items-center"
            onSubmit={(event) => { addNewUser(event) }}
          >
            <div className="col-5 form-group py-2">
              <label className="fw-medium"><span className="text-danger">(*)</span> Tên tài khoản:</label>
              <input className="form-control" type="text" name="username" placeholder="Nhập tên tài khoản" autoFocus autoComplete='username' required />
            </div>
            <div className="col-5 form-group py-2">
              <label className="fw-medium"><span className="text-danger">(*)</span> Mật khẩu:</label>
              <input className="form-control" type="password" name="password" placeholder="Nhập mật khẩu" autoComplete='current-password' required minLength={6} />
            </div>
            <div className="col-5 form-group py-2">
              <label className="fw-medium"><span className="text-danger">(*)</span> Tên:</label>
              <input className="form-control" type="text" name="fullname" placeholder="Nhập tên" required />
            </div>
            <div className="col-5 form-group py-2">
              <label className="fw-medium"><span className="text-danger">(*)</span> Vai trò:</label>
              <select name="role" className="form-select" required>
                <option>Chọn vai trò</option>
                {
                  roleData.data.map(role => (
                    <option key={role._id} value={role._id}>
                      {role.rolename}
                    </option>
                  ))
                }
              </select>
            </div>

            <div className="w-100 text-center">
              <input className="btn btn-primary mt-4 mb-2" type="submit" value="XÁC NHẬN" disabled={createUserMutation.isLoading} />
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        show={editingUser ? true : false}
        onHide={() => { setEditingUser(null) }}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">Sửa thông tin tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="d-flex flex-wrap justify-content-around align-items-center"
            onSubmit={(e) => { editUser(e) }}
          >
            <div className="col-5 form-group py-2">
              <label className="fw-medium">Đường dẫn tĩnh:</label>
              <input className="form-control" type="text" name="slug" placeholder="Nhập đường dẫn tĩnh" defaultValue={editingUser?.slug} />
            </div>
            <div className="col-5 form-group py-2">
              <label className="fw-medium">Mật khẩu: <span className="text-secondary">(Nhập để đổi)</span></label>
              <input className="form-control" type="password" name="password" placeholder="Nhập mật khẩu" minLength={6} />
            </div>
            <div className="col-5 form-group py-2">
              <label className="fw-medium"><span className="text-danger">(*)</span> Tên:</label>
              <input className="form-control" type="text" name="fullname" placeholder="Nhập tên" defaultValue={editingUser?.fullname} required />
            </div>
            <div className="col-5 form-group py-2">
              <label className="fw-medium"><span className="text-danger">(*)</span> Vai trò:</label>
              <select name="role" className="form-select" defaultValue={editingUser?.role._id} required>
                <option>Chọn vai trò</option>
                {
                  roleData.data.map(role => (
                    <option key={role._id} value={role._id}>
                      {role.rolename}
                    </option>
                  ))
                }
              </select>
            </div>

            <div className="col-5 form-group py-2">
              <label className="fw-medium">Trạng thái:</label>
              <select name="status" className="form-select" required defaultValue={editingUser?.status}>
                <option value={1} className="text-success">Kích hoạt</option>
                <option value={0} className="text-warning">Tạm khóa</option>
              </select>
            </div>

            <div className="w-100 text-center">
              <input className="btn btn-primary mt-4" type="submit" value="SỬA TÀI KHOẢN" disabled={udpateUserMutation.isLoading} />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}