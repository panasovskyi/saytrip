import styles from "./ErrorMessage.module.scss";

type Props = {
  message?: string;
  id?: string;
};

export const ErrorMessage = ({ message, id }: Props) => {
  if (!message) return null;

  return (
    <p id={id} role="alert" className={styles.message}>
      {message}
    </p>
  );
};
