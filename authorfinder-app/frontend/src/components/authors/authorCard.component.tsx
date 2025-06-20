import { Link } from "react-router";
import type { Author } from "../../model/Author";
import { FiHeart as Heart } from "react-icons/fi";
import { useState, type SyntheticEvent } from "react";


interface AuthorCardProps {
  author: Author;
  isFavorite?: boolean;
  onfavorite: (author: Author) => void;
}

function AuthorCard(props: AuthorCardProps) {
  const { author, isFavorite: isFavoriteProp, onfavorite }: AuthorCardProps = props;

  const [isFavorite, setIsFavorite] = useState(isFavoriteProp ?? false);




  function handleAddFavorite(event: SyntheticEvent): void {
    event.preventDefault();
    setIsFavorite(!isFavorite)
    // if (onfavorite) {
    //   onfavorite(author);
    // }

  }

  return (
    // <div className="col" key={author.key}>
    <div className="card h-100">

      <div className="card-body">
        <div className="d-flex w-100 justify-content-between">
          <Link to={"/authors/" + author.key} className="text-decoration-none text-dark">
            <div className="d-flex align-items-center gap-3">
              <img
                src={`https://covers.openlibrary.org/a/olid/${author.key}-M.jpg`}

                alt={author.name}
                className="img-thumbnail img-fluid"
              />
              <h5 className="mb-1 font-semibold">{author.name}</h5>

            </div>
          </Link>
          <small>
            <button
              className={isFavorite ? "btn btn-danger btn-md" : "btn btn-outline-danger btn-md"}
              onClick={handleAddFavorite}>
              {/* <span className="bi bi-heart-fill"></span> */}
              <span ><Heart size={20} /></span>

            </button>
          </small>
        </div>

        <Link to={"/authors/" + author.key} className="text-decoration-none text-dark">

          {author.top_work && (
            <p ><strong>Top Work:</strong> {author.top_work}</p>
          )}

          <small>View details...</small>
        </Link>

      </div>
    </div>
    // </div>
  );
}

export default AuthorCard;