import { useMutation, useQuery, useQueryClient } from "react-query";
import { getPagingLogs, removeLog, removeManyLogs } from "../../services/log";
import { useOutletContext } from "react-router-dom";
import PageLoading from "../../components/loading/page";
import { toast } from "react-toastify";
import { useState } from "react";
import { getAllUsers } from "../../services/user";
import showConfirmToast from "../../hooks/confirm";
import PaginationComp from "../../components/pagination";
import moment from "moment";

export default function LogPage() {
  const LOGS_KEY = 'logs';
  const USERS_KEY = 'users';
  const logedInUser = useOutletContext();
  const queryClient = useQueryClient();
  const [pagingObj, setPagingObj] = useState({
    pageIndex: 1,
    pageSize: 20,
    user: null,
    method: null,
    path: null,
    statusCode: null,
    startTime: null,
    endTime: null
  });
  const [checkedItems, setCheckedItems] = useState([]);

  const logsData = useQuery(
    [LOGS_KEY, pagingObj],
    () => getPagingLogs(pagingObj),
    { refetchOnWindowFocus: false }
  );

  const usersData = useQuery(
    [USERS_KEY],
    () => getAllUsers(),
    { refetchOnWindowFocus: false }
  );

  const deleteLogMutation = useMutation(removeLog, {
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries(LOGS_KEY);
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  const deleteManyLogsMutation = useMutation(removeManyLogs, {
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries(LOGS_KEY);
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

  if (logsData.isLoading) {
    return <PageLoading />
  }

  if (logsData.isError) {
    toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    return (
      <div className="container">
        <h1 className="h5 text-danger">Có lỗi xảy ra, vui lòng thử lại!</h1>
      </div>
    );
  }

  const handleSearch = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const newPagingObj = {
      pageIndex: 1,
      pageSize: pagingObj.pageSize,
      user: formData.get('user') || null,
      method: formData.get('method') || null,
      path: formData.get('path') || null,
      statusCode: formData.get('statusCode') || null,
      startTime: formData.get('startTime') || null,
      endTime: formData.get('endTime') || null
    };

    setPagingObj(newPagingObj);
  }

  const handleDeleteLog = async (linkId) => {
    const confirmed = await showConfirmToast("Bạn có chắc chắn muốn xóa?");
    if (confirmed) {
      deleteLogMutation.mutate(linkId);
    }
  }

  const handleCheckboxOnChange = (event, value) => {
    const { checked } = event.target;
    if (checked) {
      setCheckedItems([...checkedItems, value]);
    } else {
      setCheckedItems(checkedItems.filter(item => item !== value));
    }
  }

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    if (checked) {
      const allLogIds = logsData.data.data.map(log => log._id);
      setCheckedItems(allLogIds);
    } else {
      setCheckedItems([]);
    }
  }

  const handleDeleteSelectedLogs = () => {
    showConfirmToast("Bạn có chắc chắn muốn xóa các logs đã chọn?").then(confirmed => {
      if (confirmed) {
        deleteManyLogsMutation.mutate(checkedItems);
        setCheckedItems([]);
      }
    });
  }

  return (
    <>
      <h1 className="h5 border-start border-4 ps-2 border-dark bg-light py-2 fw-bold">Quản lý logs</h1>
      <form className="d-flex align-items-end gap-2 mt-3" onSubmit={(event) => handleSearch(event)}>
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
          <label>Method:</label>
          <select className="form-select form-select-sm" name="method" defaultValue={pagingObj.method || ''}>
            <option value="">Tất cả</option>
            <option value="POST">Tạo mới</option>
            <option value="PUT">Chỉnh sửa</option>
            <option value="DELETE">Xóa</option>
          </select>
        </div>
        <div>
          <label>Path:</label>
          <input type="text" name="path" className="form-control form-control-sm" placeholder="path" defaultValue={pagingObj.path || ''} />
        </div>
        <div>
          <label>Trạng thái:</label>
          <select className="form-select form-select-sm" name="statusCode" defaultValue={pagingObj.statusCode || ''}>
            <option value="">Tất cả</option>
            <option value="200">200</option>
            <option value="201">201</option>
            <option value="400">400</option>
            <option value="401">401</option>
            <option value="403">403</option>
            <option value="404">404</option>
            <option value="500">500</option>
          </select>
        </div>
        <div>
          <label>Thời gian bắt đầu:</label>
          <input type="datetime-local" className="form-control form-control-sm" name="startTime" defaultValue={pagingObj.startTime || ''} />
        </div>
        <div>
          <label>Thời gian kết thúc:</label>
          <input type="datetime-local" className="form-control form-control-sm" name="endTime" defaultValue={pagingObj.endTime || ''} />
        </div>

        <button className="btn btn-outline-secondary btn-sm" type="submit">Tìm kiếm</button>
      </form>

      {
        checkedItems.length > 0 && (
          <div className="mt-4">
            <button className="btn btn-danger btn-sm" onClick={() => { handleDeleteSelectedLogs() }}>Xóa các logs đã chọn</button>
            <button className="btn btn-secondary btn-sm ms-2" onClick={() => { setCheckedItems([]) }}>Hủy chọn</button>
          </div>
        )
      }

      <table className="table table-bordered table-hover mt-4">
        <thead>
          <tr>
            <th className="text-center p-2">
              <input type="checkbox" className="form-check-input cursor-pointer" checked={checkedItems.length === logsData.data.data.length} onChange={handleSelectAll} />
            </th>
            <th className="p-2">Tài khoản</th>
            <th className="p-2">Method</th>
            <th className="p-2">Path</th>
            <th className="p-2">Body</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Thời gian</th>
            <th className="text-center p-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {
            logsData.data?.data.length > 0 ? (
              logsData.data.data.map((log, index) => (
                <tr key={log._id}>
                  <td className="text-center p-2">
                    <input type="checkbox" className="form-check-input cursor-pointer" value={log._id} checked={checkedItems.includes(log._id)} onChange={(event) => handleCheckboxOnChange(event, log._id)} />
                  </td>
                  <td className="p-2">{log.user ? log.user.fullname : 'N/A'}</td>
                  <td className="p-2">{log.method}</td>
                  <td className="p-2">{log.path}</td>
                  <td className="text-break p-2 col-3 small">
                    <div style={{ maxHeight: 100, overflowY: 'auto' }}>
                      {log.body}
                    </div>
                  </td>
                  <td className="p-2">{log.statusCode}</td>
                  <td className="p-2">{moment(log.requestTime).format('HH:mm DD/MM/YYYY')}</td>
                  <td className="text-center p-2">
                    {logedInUser.role.rolename === 'Admin' && (
                      <>
                        <button className="btn btn-sm btn-danger py-0" onClick={() => handleDeleteLog(log._id)}>Xóa</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={99} className="text-center p-2">Không có dữ liệu</td>
              </tr>
            )
          }
        </tbody>
      </table>

      {
        logsData.data && logsData.data.totalPage > 1 && (
          <PaginationComp
            pageIndex={logsData.data.pageIndex}
            pageSize={logsData.data.pageSize}
            totalPage={logsData.data.totalPage}
            setPagingObj={setPagingObj}
          />
        )
      }
    </>
  );
}