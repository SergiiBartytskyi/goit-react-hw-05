import css from "./ErrorMessage.module.css";
import { IErrorMessageProps } from "./ErrorMessage.types";

const ErrorMessage = ({ message }: IErrorMessageProps) => {
  return (
    <p className={css.errorText}>
      {message || "Whoops, something went wrong! Try again later!"}
    </p>
  );
};

export default ErrorMessage;
