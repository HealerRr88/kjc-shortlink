import { Pagination } from "react-bootstrap";

export default function PaginationComp({ pageIndex, pageSize, totalPage, setPagingObj }) {
  const pagingItems = [];
  for (let i = 1; i <= totalPage; i++) {
    if (i === 1 || i === totalPage || i === pageIndex || i === pageIndex - 1 || i === pageIndex + 1) {
      pagingItems.push(
        <Pagination.Item key={i} active={i === pageIndex}
          onClick={() => {
            setPagingObj(old => {
              return { ...old, pageIndex: i }
            })
          }}
        >
          {i}
        </Pagination.Item>
      );
    }
    else if (i === pageIndex - 2 || i === pageIndex + 2) {
      pagingItems.push(
        <Pagination.Ellipsis key={i} disabled
        />
      );
    }
  }

  return (
    <div className="d-flex align-items-start mt-5">
      <div>
        <Pagination>
          <Pagination.First onClick={() => {
            setPagingObj(old => {
              return { ...old, pageIndex: 1 }
            })
          }} />
          <Pagination.Prev onClick={() => {
            setPagingObj(old => {
              return { ...old, pageIndex: old.pageIndex > 1 ? old.pageIndex - 1 : 1 }
            })
          }} />
          {pagingItems}
          <Pagination.Next onClick={() => {
            setPagingObj(old => {
              return { ...old, pageIndex: old.pageIndex < totalPage ? old.pageIndex + 1 : totalPage }
            })
          }} />
          <Pagination.Last onClick={() => {
            setPagingObj(old => {
              return { ...old, pageIndex: totalPage }
            })
          }} />
        </Pagination>
      </div>
      <div className="d-flex align-items-center ms-3">
        <div className="col-6">Hiển thị: </div>
        <select className="form-select form-select-sm" style={{ minWidth: 80 }}
          defaultValue={pageSize}
          onChange={(event) => { setPagingObj(old => { return { ...old, pageSize: event.target.value } }) }}>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
        </select>
      </div>
    </div>
  )
}