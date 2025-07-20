import { createLink, getPagingLinks, removeLink, updateLink } from "../../services/link";
import PageLoading from "../../components/loading/page";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import PaginationComp from "../../components/pagination";
import { useOutletContext } from "react-router-dom";
import { getAllUsers } from "../../services/user";
import { randomString } from "../../utilities/functions";
import moment from "moment";
import showConfirmToast from "../../hooks/confirm";
import { CLIENT_URL } from "../../utilities/config";

export default function LinkPage() {
  const LINKS_KEY = 'links';
  const USERS_KEY = 'users';
  const logedInUser = useOutletContext();
  const queryClient = useQueryClient();
  const [isShowCreateLinkModal, setIsShowCreateLinkModal] = useState(false);
  const [updatingData, setUpdatingData] = useState(null);

  let pagingObjInit = {
    pageIndex: 1,
    pageSize: 20,
    user: null,
    key: null,
    url: null,
    note: null
  };

  if (logedInUser?.role.rolename !== 'Admin') {
    pagingObjInit.user = logedInUser._id;
  }

  const [pagingObj, setPagingObj] = useState(pagingObjInit);

  const linksData = useQuery(
    [LINKS_KEY, pagingObj],
    () => getPagingLinks(pagingObj),
    {
      enabled: !!pagingObj
    },
    { refetchOnWindowFocus: false }
  );

  const usersData = useQuery(
    [USERS_KEY],
    () => getAllUsers(),
    {
      enabled: logedInUser?.role.rolename === 'Admin'
    },
    { refetchOnWindowFocus: false }
  );

  const createLinkMutation = useMutation(createLink, {
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries(LINKS_KEY);
      setIsShowCreateLinkModal(false);
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  const updateLinkMutation = useMutation(updateLink, {
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries(LINKS_KEY);
      setUpdatingData(null);
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  const deleteLinkMutation = useMutation(removeLink, {
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries(LINKS_KEY);
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  if (linksData.isLoading || usersData.isLoading) {
    return <PageLoading />;
  }

  if (linksData.isError || usersData.isError) {
    toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    return (
      <div className="container">
        <h1 className="h5 text-danger">Có lỗi xảy ra, vui lòng thử lại!</h1>
      </div>
    );
  }

  const handleCreateLink = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      user: formData.get('user') || logedInUser._id,
      key: formData.get('key'),
      url: formData.get('url'),
      note: formData.get('note') || ''
    };

    if (!data.key || !data.url) {
      toast.warning('Hãy nhập đầy đủ thông tin!');
      return;
    }

    createLinkMutation.mutate(data);
  }

  const handleUpdateLink = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      _id: updatingData._id,
      user: formData.get('user') || logedInUser._id,
      key: formData.get('key'),
      url: formData.get('url'),
      note: formData.get('note') || ''
    };
    if (!data.key || !data.url) {
      toast.warning('Hãy nhập đầy đủ thông tin!');
      return;
    }
    updateLinkMutation.mutate(data);
  }

  const handleDeleteLink = async (linkId) => {
    const confirmed = await showConfirmToast("Bạn có chắc chắn muốn xóa?");
    if (confirmed) {
      deleteLinkMutation.mutate(linkId);
    }
  }

  const handleSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newPagingObj = {
      pageIndex: 1,
      pageSize: pagingObj.pageSize,
      user: formData.get('user') || null,
      key: formData.get('key') || null,
      url: formData.get('url') || null,
      note: formData.get('note') || null
    };

    setPagingObj(newPagingObj);
  }

  return (
    <>
      <h1 className="h5 border-start border-4 ps-2 border-dark bg-light py-2 fw-bold">Quản lý shortlinks</h1>
      <div className="d-flex justify-content-between align-items-end mt-4">
        <form className="d-flex align-items-end gap-2" onSubmit={(event) => { handleSearch(event); }}>
          {
            logedInUser?.role.rolename === 'Admin' && (
              <>
                <div>
                  <label>Tài khoản:</label>
                  <select className="form-select form-select-sm" name="user" defaultValue={pagingObj.user || ''}>
                    <option value="">Tất cả</option>
                    {usersData.data && usersData.data.map(user => (
                      <option key={user._id} value={user._id}>{user.fullname}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Key:</label>
                  <input className="form-control form-control-sm" name="key" type="text" placeholder="Nhập key" defaultValue={pagingObj.key || ''} />
                </div>
                <div>
                  <label>Url:</label>
                  <input className="form-control form-control-sm" name="url" type="text" placeholder="Nhập url" defaultValue={pagingObj.url || ''} />
                </div>
                <div>
                  <label>Ghi chú:</label>
                  <input className="form-control form-control-sm" name="note" type="text" placeholder="Nhập ghi chú" defaultValue={pagingObj.note || ''} />
                </div>

                <div>
                  <input className="btn btn-outline-secondary btn-sm" type="submit" value="Tìm kiếm" />
                </div>
              </>
            )
          }
        </form>

        <button className="btn btn-primary d-flex align-items-center ms-auto" onClick={() => { setIsShowCreateLinkModal(true) }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link" viewBox="0 0 16 16">
            <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
            <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z" />
          </svg>
          <span className="ms-2">Tạo mới</span>
        </button>
      </div>

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th className="p-2">Key</th>
            <th className="p-2">URL</th>
            <th className="p-2">Shortlink</th>
            {
              logedInUser?.role.rolename === 'Admin' && (
                <th className="p-2">Người dùng</th>
              )
            }
            <th className="p-2">Thời gian tạo</th>
            <th className="p-2">Ghi chú</th>
            <th className="p-2 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {
            linksData.data?.data.length > 0 ? (
              linksData.data.data.map(link => (
                <tr key={link._id}>
                  <td className="p-2">{link.key}</td>
                  <td className="p-2">
                    <a className="text-dark" href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                  </td>
                  <td>
                    <a className="text-dark" href={`${CLIENT_URL}/${link.key}`} target="_blank" rel="noopener noreferrer">
                      {`${CLIENT_URL}/${link.key}`}
                    </a>
                  </td>
                  {
                    logedInUser?.role.rolename === 'Admin' && (
                      <td className="p-2">{link.user ? link.user.fullname : 'N/A'}</td>
                    )
                  }
                  <td className="p-2">{moment(link.createdTime).format('HH:mm DD/MM/YYYY')}</td>
                  <td className="p-2">{link.note || 'N/A'}</td>
                  <td className="p-2" style={{ minWidth: 150 }}>
                    <div className="d-flex justify-content-center align-items-center">
                      <button className="btn btn-sm btn-primary py-0 me-2" onClick={() => { setUpdatingData(link) }}>Sửa</button>
                      <button className="btn btn-sm btn-danger py-0" onClick={() => { handleDeleteLink(link._id) }}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="99" className="text-center p-2">Không có dữ liệu</td>
              </tr>
            )
          }
        </tbody>
      </table>

      {
        linksData.data && linksData.data.totalPage > 1 && (
          <PaginationComp
            pageIndex={linksData.data.pageIndex}
            pageSize={linksData.data.pageSize}
            totalPage={linksData.data.totalPage}
            setPagingObj={setPagingObj}
          />
        )
      }

      <Modal
        show={isShowCreateLinkModal}
        onHide={() => { setIsShowCreateLinkModal(false); }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="border-0 mb-0" closeButton>
          <Modal.Title className="h5">Tạo mới shortlink</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(event) => { handleCreateLink(event); }} className="d-flex flex-column gap-3">
            {
              logedInUser?.role.rolename === 'Admin' && (
                <div>
                  <label className="fw-medium"><span className="text-danger">(*)</span> Người dùng:</label>
                  <select className="form-select" name="user">
                    <option value="">-- Chọn người dùng --</option>
                    {
                      usersData.data.map(user => (
                        <option key={user._id} value={user._id}>{user.fullname}</option>
                      ))
                    }
                  </select>
                </div>
              )
            }

            <div>
              <label className="fw-medium"><span className="text-danger">(*)</span> Key:</label>
              <input className="form-control" name="key" type="text" placeholder="Nhập key" defaultValue={randomString(8, 0)} />
            </div>

            <div>
              <label className="fw-medium"><span className="text-danger">(*)</span> Url:</label>
              <input className="form-control" name="url" type="text" placeholder="Nhập url" />
            </div>

            <div>
              <label className="fw-medium">Ghi chú:</label>
              <input className="form-control" name="note" type="text" placeholder="Ghi chú" />
            </div>

            <div className="text-center mt-4">
              <input className="btn btn-primary" type="submit" value="XÁC NHẬN" disabled={createLinkMutation.isLoading} />
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        show={updatingData !== null}
        onHide={() => { setUpdatingData(null); }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="border-0 mb-0" closeButton>
          <Modal.Title className="h5">Chỉnh sửa shortlink</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(event) => { handleUpdateLink(event); }} className="d-flex flex-column gap-3">
            {
              logedInUser?.role.rolename === 'Admin' && (
                <div>
                  <label className="fw-medium"><span className="text-danger">(*)</span> Người dùng:</label>
                  <select className="form-select" name="user" defaultValue={updatingData?.user?._id || ''}>
                    <option value="">-- Chọn người dùng --</option>
                    {
                      usersData.data.map(user => (
                        <option key={user._id} value={user._id}>{user.fullname}</option>
                      ))
                    }
                  </select>
                </div>
              )
            }
            <div>
              <label className="fw-medium"><span className="text-danger">(*)</span> Key:</label>
              <input className="form-control" name="key" type="text" placeholder="Nhập key" defaultValue={updatingData?.key} />
            </div>

            <div>
              <label className="fw-medium"><span className="text-danger">(*)</span> Url:</label>
              <input className="form-control" name="url" type="text" placeholder="Nhập url" defaultValue={updatingData?.url} />
            </div>

            <div>
              <label className="fw-medium">Ghi chú:</label>
              <input className="form-control" name="note" type="text" placeholder="Ghi chú" defaultValue={updatingData?.note} />
            </div>

            <div className="text-center mt-4">
              <input className="btn btn-primary" type="submit" value="XÁC NHẬN" disabled={createLinkMutation.isLoading} />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}