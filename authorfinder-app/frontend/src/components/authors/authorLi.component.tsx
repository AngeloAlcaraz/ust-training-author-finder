import { Link } from "react-router";
import type { Author } from "../../model/Author";
import { useState, type SyntheticEvent } from "react";

interface AuthorLiProps {
  author: Author;
  isFavorite?: boolean;
  onfavorite: (author: Author, isFavorite: boolean) => void;
}

function AuthorLi(props: AuthorLiProps) {

  const { author, isFavorite: isFavoriteProp, onfavorite }: AuthorLiProps = props;
  const [isFavorite, setIsFavorite] = useState(isFavoriteProp ?? false);

  function handleAddFavorite(event: SyntheticEvent): void {
    event.preventDefault();

    setIsFavorite(!isFavorite)
    onfavorite(author, isFavorite);

  }

  return (
    <>
      <div className="d-flex w-100 justify-content-between">
        <Link to={"/authors/" + author.key} className="text-decoration-none text-dark">
          <div className="d-flex align-items-center gap-3">
            {/* <img
                          // src={`https://covers.openlibrary.org/a/olid/${author.key}-M.jpg`}
                          src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOVriLPru6AjmM5u0mjgJA67XQfeM27a1gAA&s`}

                          alt={author.name}
                          className="img-fluid"
                        /> */}
            <h5 className="mb-1 font-semibold">{author.name}</h5>
          </div>
        </Link>
        <small>
          <button
            onClick={handleAddFavorite}
            className={isFavorite ? "btn btn-danger btn-md" : "btn btn-outline-danger btn-md"}>

            {/* <span className="bi bi-heart-fill"></span> */}
            <span className="bi bi-heart"></span>

          </button>
        </small>
      </div>

      <Link to={"/authors/" + author.key} className="text-decoration-none text-dark">

        {author.top_work && (
          <p >Top Work: {author.top_work}</p>
        )}

        <small>View details...</small>
      </Link>
    </>
  );

}

export default AuthorLi;


