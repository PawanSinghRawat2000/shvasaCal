import React from 'react'
import ReactPaginate from 'react-paginate';
import './pagination.css'

function Pagination({ setPage, totalPages }) {
    return (
        <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={(page) => setPage(page.selected + 1)}
            containerClassName="pagination"
            activeClassName="active"
        />
    )
}

export default Pagination
