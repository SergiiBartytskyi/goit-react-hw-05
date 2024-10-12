import css from "./LoadMoreBtn.module.css";
import { LoadMoreBtnProps } from "./LoadMoreBtn.types";

const LoadMoreBtn = ({ onClick }: LoadMoreBtnProps) => {
  return (
    <div className={css.container}>
      <button type="button" className={css.loadMoreBtn} onClick={onClick}>
        Load more
      </button>
    </div>
  );
};

export default LoadMoreBtn;
