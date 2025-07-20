export const BEARER = "Bearer ";
export const TOKEN_NAME = 'rr88-shortlink-token';
export const RR88_SHORTLINK_USER = 'rr88-shortlink-user';
export const ACCESS_ADMIN_ACTION = 'access-admin';

export const actions = [
  {
    name: 'access-admin',
    viName: 'Truy cập trang quản lý',
  },
  {
    name: 'create-user',
    viName: 'Tạo tài khoản mới',
  },
  {
    name: 'update-user',
    viName: 'Sửa thông tin tài khoản',
  },
  {
    name: 'get-user',
    viName: 'Xem chi tiết tài khoản',
  },
  {
    name: 'get-users',
    viName: 'Xem danh sách tài khoản',
  },
  {
    name: 'delete-user',
    viName: 'Xóa tài khoản',
  },

  //role
  {
    name: 'create-role',
    viName: 'Tạo vai trò mới',
  },
  {
    name: 'update-role',
    viName: 'Sửa thông tin vai trò',
  },
  {
    name: 'get-role',
    viName: 'Xem chi tiết vai trò',
  },
  {
    name: 'get-roles',
    viName: 'Xem danh sách vai trò',
  },
  {
    name: 'delete-role',
    viName: 'Xóa vai trò',
  },

  //link
  {
    name: 'create-link',
    viName: 'Tạo link rút gọn',
  },
  {
    name: 'update-link',
    viName: 'Sửa link rút gọn',
  },
  {
    name: 'get-links',
    viName: 'Xem danh sách link rút gọn',
  },
  {
    name: 'delete-link',
    viName: 'Xóa link rút gọn',
  },

  //log
  {
    name: 'get-logs',
    viName: 'Xem danh sách logs',
  },
  {
    name: 'delete-log',
    viName: 'Xóa log',
  },
]