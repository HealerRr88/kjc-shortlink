import { useMutation, useQuery, useQueryClient } from "react-query";
import { createRole, getPagingRoles, updateRole, removeRole } from "../../services/role";
import { useState } from "react";
import PageLoading from "../../components/loading/page";
import { toast } from "react-toastify";
import { Link, useOutletContext } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { actions } from "../../utilities/constants";
import moment from "moment";
import PaginationComp from "../../components/pagination";

const PAGING_ROLES_KEY = 'paging-roles';

const getViNameActions = (stringActions) => {
  let viNameActions = []
  stringActions?.forEach(strAc => {
    const viNameAction = actions.find(x => x.name === strAc)?.viName;
    viNameActions.push(viNameAction);
  });
  return viNameActions;
}

export default function RolePage() {
  const logedInUser = useOutletContext();
  const [actionState, setActionState] = useState(actions);
  const [isShowCreateRoleModal, setIsShowCreateRoleModal] = useState(false);
  const [actionsToCreate, setActionsToCreate] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const queryClient = useQueryClient();
  const [pagingObj, setPagingObj] = useState({
    pageIndex: 1,
    pageSize: 20
  });

  const rolesData = useQuery(
    [PAGING_ROLES_KEY, pagingObj],
    () => getPagingRoles(pagingObj),
    { refetchOnWindowFocus: false }
  );

  const createRoleMutation = useMutation(createRole, {
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries(PAGING_ROLES_KEY);
      setIsShowCreateRoleModal(false);
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  const updateRoleMutation = useMutation(updateRole, {
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries(PAGING_ROLES_KEY);
      setIsShowCreateRoleModal(false);
    },
    onError: error => {
      toast.error(error.message);
    }
  });
  const deleteRoleMutation = useMutation(removeRole, {
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries(PAGING_ROLES_KEY);
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

  if (rolesData.isLoading) {
    return <PageLoading />
  }

  if (rolesData.isError) {
    toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    return;
  }

  const addNewRole = (event) => {
    event.preventDefault();
    const rolename = event.target.rolename.value;
    const actions = actionsToCreate.map(x => x.name);
    if (rolename && actions.length > 0) {
      const data = { rolename, actions };
      createRoleMutation.mutate(data);
    }
  }

  const selectActionToCreate = (event) => {
    const action = actions.find(x => x.name === event.target.value);
    if (action) {
      setActionsToCreate(old => {
        if (!old.find(x => x.name === action.name)) {
          setActionState(old => old.filter(x => x.name !== action.name));
          return [...old, { ...action }]
        }
        else {
          return old;
        }
      })
    }
  }

  const selectActionToUpdate = (event) => {
    const action = actions.find(x => x.name === event.target.value);
    setEditingRole(old => {
      if (!old?.actions.find(x => x === action.name)) {
        setActionState(old => old.filter(x => x.name !== action.name));
        return { ...old, actions: [...old.actions, action.name] }
      }
      else {
        return old;
      }
    })
  }

  const removeActionToCreate = (actionName) => {
    setActionsToCreate(old => {
      return old.filter(x => x?.name !== actionName);
    })
  }

  const removeActionToUpdate = (viName) => {
    const action = actions.find(x => x.viName === viName);
    setEditingRole(old => {
      return { ...old, actions: old.actions.filter(x => x !== action.name) };
    })
  }

  const editRole = (event) => {
    event.preventDefault();
    const rolename = event.target.rolename.value;
    if (rolename && editingRole?.actions.length > 0) {

      updateRoleMutation.mutate(
        {
          _id: editingRole._id,
          rolename: rolename,
          actions: editingRole.actions
        }
      );
    }
    else {
      toast.warning('Vui lòng nhập đủ thông tin!');
    }
  }

  const deleteRole = (id) => {
    const oke = window.confirm('Bạn có chắc chắn muốn xóa?');
    if (oke) {
      deleteRoleMutation.mutate(id);
    }
  }

  return (
    <>
      <h1 className="h5 border-start border-4 ps-2 border-dark bg-light py-2 fw-bold">Quản lý vai trò</h1>
      <div className="d-flex justify-content-between mt-3">
        <div></div>
        <button className="btn btn-primary d-flex align-items-center" onClick={() => { setIsShowCreateRoleModal(true) }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-plus" viewBox="0 0 16 16">
            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
            <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5" />
          </svg>
          <span className="ms-2">Tạo mới</span>
        </button>
      </div>

      <table className="table table-bordered table-responsive mt-3">
        <thead>
          <tr className="text-center">
            <th>Tên vai trò</th>
            <th>Các quyền</th>
            <th>Thời gian tạo</th>
            <th>Người tạo</th>
            <th>Thời gian sửa</th>
            <th>Người sửa</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {
            rolesData.data.data.map(roleItem => (
              <tr key={roleItem._id} className="text-center">
                <td>{roleItem.rolename}</td>
                <td className="col-5">
                  <div className="d-flex flex-wrap">
                    {
                      getViNameActions(roleItem.actions).map(viNameAction => (
                        <div className="small border rounded-2 px-2 py-1 m-1" key={viNameAction}>{viNameAction}</div>
                      ))
                    }
                  </div>
                </td>
                <td>{moment(roleItem.createdTime).format('HH:mm DD/MM/YYYY')}</td>
                <td>{roleItem.createdBy?.fullname}</td>
                <td>{moment(roleItem.updatedTime).format('HH:mm DD/MM/YYYY')}</td>
                <td>{roleItem.updatedBy?.fullname}</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <Link className="text-danger" title="Xóa" onClick={() => { deleteRole(roleItem._id) }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                      </svg>
                    </Link>
                    <Link className="text-primary ms-3" title="Sửa" onClick={() => { setEditingRole(roleItem) }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                      </svg>
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

      <PaginationComp
        pageIndex={rolesData.data.pageIndex}
        pageSize={rolesData.data.pageSize}
        totalPage={rolesData.data.totalPage}
        setPagingObj={setPagingObj}
      />

      <Modal
        show={isShowCreateRoleModal}
        onHide={() => { setIsShowCreateRoleModal(false) }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">Tạo vai trò mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { addNewRole(e) }}>
            <div className="form-group">
              <label className="fw-medium"><span className="text-danger">(*)</span> Tên vai trò:</label>
              <input className="form-control" type="text" name="rolename" placeholder="Nhập tên vai trò" required />
            </div>
            <div className="form-group mt-3">
              <label className="fw-medium w-100 d-flex justify-content-between"><span><span className="text-danger">(*)</span> Các quyền: <span className="text-secondary cursor-pointer" onClick={() => { setActionsToCreate(actions) }}>Chọn tất cả</span></span> {actionsToCreate.length > 0 ? <small className="cursor-pointer text-danger" onClick={() => { setActionsToCreate([]) }}>(Xóa tất cả)</small> : <></>}</label>
              <div className="pt-1 pb-2 d-flex flex-wrap">
                {
                  actionsToCreate.map(action => (
                    <small className="px-2 py-1 border rounded ms-2 mt-2 position-relative" key={action.name}>
                      {action.viName}
                      <span
                        className="position-absolute text-danger cursor-pointer"
                        style={{ right: -6, bottom: 19 }}
                        onClick={() => {
                          removeActionToCreate(action.name);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                        </svg>
                      </span>
                    </small>
                  ))
                }
              </div>
              <select className="form-select mt-2"
                onChange={(e) => { selectActionToCreate(e) }}
              >
                <option value={''}>Chọn quyền vai trò được thực hiện</option>
                {
                  actionState.map(ac => (
                    <option key={ac.name} value={ac.name}>
                      {ac.viName}
                    </option>
                  ))
                }
              </select>
            </div>
            <div className="text-center mt-4">
              <input className="btn btn-primary" type="submit" value="TẠO VAI TRÒ" disabled={createRoleMutation.isLoading} />
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        show={editingRole ? true : false}
        onHide={() => { setEditingRole(null) }}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">Chỉnh sửa vai trò</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { editRole(e) }}>
            <div className="form-group">
              <label className="fw-medium"><span className="text-danger">(*)</span> Tên vai trò:</label>
              <input className="form-control" type="text" name="rolename" placeholder="Nhập tên vai trò" required defaultValue={editingRole?.rolename} />
            </div>
            <div className="form-group mt-3">
              <label className="fw-medium w-100 d-flex justify-content-between">
                <span>
                  <span className="text-danger">(*)</span> Các quyền: <span className="text-secondary cursor-pointer"
                    onClick={() => {
                      setEditingRole(old => { return { ...old, actions: actions.map(x => x.name) } })
                    }}
                  >
                    Chọn tất cả
                  </span>
                </span>
                {
                  editingRole?.actions.length > 0 ? <small className="cursor-pointer text-danger"
                    onClick={() => { setEditingRole(old => { return { ...old, actions: [] } }) }}
                  >
                    (Xóa tất cả)
                  </small> : <></>
                }
              </label>
              <div className="pt-1 pb-2 d-flex flex-wrap">
                {
                  getViNameActions(editingRole?.actions).map(viName => (
                    <small className="px-2 py-1 border rounded ms-2 mt-2 position-relative" key={viName}>
                      {viName}
                      <span
                        className="position-absolute text-danger cursor-pointer"
                        style={{ right: -6, bottom: 19 }}
                        onClick={() => {
                          removeActionToUpdate(viName);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                        </svg>
                      </span>
                    </small>
                  ))
                }
              </div>
              <select className="form-select mt-2"
                onChange={(e) => { selectActionToUpdate(e) }}
              >
                <option value={''}>Chọn quyền vai trò được thực hiện</option>
                {
                  actionState.map(ac => (
                    <option key={ac.name} value={ac.name}>
                      {ac.viName}
                    </option>
                  ))
                }
              </select>
            </div>
            <div className="text-center mt-4">
              <input className="btn btn-primary" type="submit" value="SỬA VAI TRÒ" disabled={updateRoleMutation.isLoading} />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}
