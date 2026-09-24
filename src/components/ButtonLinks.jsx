import { Link } from "react-router-dom";

export function GoToCategories({ classname, id, text }) {
  return (
    <Link className={classname} to={`/group-opener/category/${id}`}>
      {text}
    </Link>
  );
}
