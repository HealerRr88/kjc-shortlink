import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { getUserByToken, updateUser } from "../../services/user";
import moment from "moment";
import PageLoading from "../../components/loading/page";

export default function ProfilePage() {
  const USER_KEY = 'user-key';
  const queryClient = useQueryClient();
  const [editingData, setEditingData] = useState(null);

  const userData = useQuery(
    [USER_KEY],
    () => getUserByToken(),
    { refetchOnWindowFocus: false }
  );

  const udpateUserMutation = useMutation(updateUser, {
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries(USER_KEY);
      setEditingData(null);
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  if (userData.isLoading) {
    return <PageLoading />
  }
  if (userData.isError) {
    toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    return;
  }

  const editUser = async (event) => {
    event.preventDefault();
    const password = event.target.password.value;
    const fullname = event.target.fullname.value;
    if (fullname) {
      let data = {
        _id: userData.data._id,
        fullname,
      };

      if (password) {
        data = { ...data, password };
      }

      await udpateUserMutation.mutateAsync(data);
    }
    else {
      toast.warning('Vui lòng nhập đủ thông tin!')
    }
  }

  return (
    <>
      <div className="col-5 m-auto" style={{ minWidth: 640, maxWidth: '100%' }}>
        <div className="col-6 m-auto">
          <h4 className="text-center my-4 py-2 text-white fw-bold bg-primary">Thông tin tài khoản</h4>
          <div className="d-flex align-items-center justify-content-between">
            <div className="fw-bold">Họ tên:</div>
            <div>{userData.data.fullname}</div>
          </div>
          <hr />
          <div className="d-flex align-items-center justify-content-between">
            <div className="fw-bold">Ngày tạo:</div>
            <div>{moment(userData.data.createdTime).parseZone('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>
          <div className="mt-5 text-center cursor-pointer text-primary" onClick={() => { setEditingData(userData.data) }}>
            Thay đổi thông tin
          </div>
        </div>
      </div>

      <Modal
        show={editingData ? true : false}
        onHide={() => { setEditingData(null) }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">Sửa thông tin tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { editUser(e) }}>
            <div className="mt-3">
              <label>Mật khẩu mới:</label>
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="Nhập để đổi mật khẩu"
                autoComplete='current-password'
                minLength={6}
                defaultValue={editingData?.password}
              />
            </div>
            <div className="mt-3">
              <label><span className="text-danger">(*)</span> Họ tên:</label>
              <input
                className="form-control"
                type="text"
                name="fullname"
                placeholder="Nhập tên hiển thị"
                required
                defaultValue={editingData?.fullname}
              />
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