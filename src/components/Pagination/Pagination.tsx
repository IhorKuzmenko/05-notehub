import ReactPaginate from "react-paginate";

import css from "./Pagination.module.css"; 

const PaginateComponent = ReactPaginate.default || ReactPaginate;

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedPage: number) => void;
}

export function Pagination({ pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <PaginateComponent
      previousLabel="← Попередня"
      nextLabel="Наступна →"
      pageCount={pageCount}
      onPageChange={(event: { selected: number }) => onPageChange(event.selected + 1)}
      containerClassName={css.pagination}     
      activeClassName={css.active}      
    />
  );
}