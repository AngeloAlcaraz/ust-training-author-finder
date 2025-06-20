import { useEffect, useState, type SyntheticEvent } from "react";
import type { Author } from "../model/Author";
import { useNavigate, useParams } from "react-router";
import authorAPI from "../services/author.service";
import LoadingSpinner from "../components/share/loadingSpinner.component";
import { FiHeart as Heart } from "react-icons/fi";
import useIsMobile from "../hooks/useIsMobil";
import { authServiceAPI } from "../services/auth.service";
import { useLocation } from 'react-router-dom';

interface AuthorPageProps {
  isFavoriteFromServer?: boolean;
  onAddFavorite?: (author: Author, isFavorite: boolean) => void;
}

function AuthorPage(props: AuthorPageProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const { isFavoriteFromServer, onAddFavorite } = props;
  const { isFavoriteFromCard } = location.state || {};


  const [isLogin, setIsLogin] = useState(false)
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState<Author | null>(null);
  const [authorWorks, setAuthorWorks] = useState<any[]>([]);
  // const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const params = useParams();
  const id = params.authorId;


  const isMobil = useIsMobile();

  useEffect(() => {

    console.log('Validating credentials...');
    const user = authServiceAPI.getCurrentUser();

    const fetchAuthor = async () => {
      setLoading(true);
      try {
        const authorData = await authorAPI.getAuthorById(id);
        setAuthor(authorData);
        console.log("Author Data 1:", authorData);

        const worksData = await authorAPI.getAuthorWorksById(id);
        setAuthorWorks(worksData);
        console.log("workAuthorData:", authorData);

        if (isFavoriteFromServer !== undefined)
          setIsFavorite(isFavoriteFromServer);
        else if (isFavoriteFromCard !== undefined) {

          setIsFavorite(isFavoriteFromCard);
        }


      } catch (e) {
        // setError(e as string);
        navigate("/notfound");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      setIsLogin(true);
      fetchAuthor();
    }
    else {
      console.log('No user found.');
    }
  }, [id]);

  function handleAddFavoriteFromAPI(event: SyntheticEvent): void {
    // console.log("Adding author to favorites:", author);
    event.preventDefault();
    setLoading(true);
    setIsFavorite(!isFavorite);
    if (onAddFavorite) {
      onAddFavorite(author as Author, isFavorite);
    }
    setLoading(false);
  }

  return (
    <>
      {
        isLogin ? (
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen">
            {/* <button
        onClick={() => {

          setAuthor(null);
          setAuthorWorks([]);
        }}
        className=""
      >
        <span className="">→</span> Back to Search
      </button> */}

            {author && (

              <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <div className="container">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex ">
                            <div className="p-2 w-100">
                              <img
                                src={`https://covers.openlibrary.org/a/olid/${id}-M.jpg`}
                                alt={author.name}
                                className="img-fluid"
                              />
                            </div>


                            <div className="p-2 flex-row-reverse">
                              <small className="">
                                {!isMobil ? (
                                  <button
                                    onClick={handleAddFavoriteFromAPI}
                                    className={isFavorite ? "btn btn-danger btn-md " : " btn btn-outline-danger btn-md "}
                                    disabled={loading}
                                  >
                                    {loading ? 'Adding...' : <><Heart size={20} /> {isFavorite ? <span> Remove from Favorites </span> : <span>Add to Favorites </span>} </>}
                                  </button>
                                )
                                  : (
                                    <button
                                      onClick={handleAddFavoriteFromAPI}
                                      className={isFavorite ? "btn btn-danger btn-sm " : " btn btn-outline-danger btn-sm "}
                                      disabled={loading}
                                    >
                                      {loading ? 'Adding...' : <><Heart size={20} /> </>}
                                    </button>
                                  )
                                }

                              </small>
                            </div>

                          </div>
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-3xl font-extrabold text-gray-800">
                              {author.name}
                            </h2>
                          </div>

                          {author.birth_date && (
                            <p className="text-gray-600 text-sm mb-2">Born: {author.birth_date}</p>
                          )}
                          {author.death_date && (
                            <p className="text-gray-600 text-sm mb-4">Died: {author.death_date}</p>
                          )}

                          {author.bio?.value && (
                            <div className="mb-6">
                              <h3 className="fs-3">Biography</h3>
                              <p className="text-start">{author.bio.value}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>



                {authorWorks.length > 0 && (
                  <div className="container ">
                    <ul className="list-group list-group-flush ">
                      <li className="list-group-item">
                        <h3 className="fs-4">Works by {author.name}</h3>
                      </li>
                      {authorWorks.map((work) => (
                        <li key={work.key} className="list-group-item">
                          <div className="card">
                            <div className="card-body">
                              <p className="fs-5">{work.title}</p>
                              {work.first_publish_date && (
                                <p className="fs-6">Published: {work.first_publish_date}</p>
                              )}
                              {work.subjects && work.subjects.length > 0 && (
                                <p className="fs-6">
                                  Subjects: {work.subjects.slice(0, 3).join(', ')}{work.subjects.length > 3 ? '...' : ''}
                                </p>
                              )}
                            </div>

                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {authorWorks.length === 0 && !loading && (
                  <p className="text-gray-600 text-center mt-8">No published works found for this author in Open Library.</p>
                )}
              </div>
            )}
            {loading && (
              <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="alert alert-warning d-flex align-items-center" role="alert">
              <div>
                <h3>Unauthorize: Please Sing in</h3 >
              </div >
            </div >

          </>
        )
      }
    </>


  );
}

export default AuthorPage;