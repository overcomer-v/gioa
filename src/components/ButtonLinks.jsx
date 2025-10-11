import { useEffect } from "react";
import { Link } from "react-router-dom";

export function GoToCategories({ classname, text }) {
  return (
    <Link className={classname} to={`/group-opener/category/${text}`}>
      {text}
    </Link>
  );
}
