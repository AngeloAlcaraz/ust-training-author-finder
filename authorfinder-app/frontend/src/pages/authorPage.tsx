import { useEffect, useState, type SyntheticEvent } from "react";
import type { Author } from "../model/Author";
import { useParams } from "react-router";
import authorAPI from "../services/author.service";
import LoadingSpinner from "../components/share/loadingSpinner.component";
import type { Auth } from "../Auth/auth";
import { FiHeart as Heart } from "react-icons/fi";
import useIsMobile from "../hooks/useIsMobil";

interface AuthorPageProps {
  onAddFavorite?: (author: Author) => void;
}

function AuthorPage(props: AuthorPageProps) {

  const { onAddFavorite } = props;

  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState<Author | null>(null);
  const [authorWorks, setAuthorWorks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params.authorId;


  const isMobil = useIsMobile();

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true);
      try {
        const authorData = await authorAPI.getAuthorById(id);
        setAuthor(authorData);
        console.log("Author Data 1:", authorData);

        const worksData = await authorAPI.getAuthorWorksById(id);
        setAuthorWorks(worksData);
        console.log("workAuthorData:", authorData);

      } catch (e) {
        setError(e as string);
      } finally {
        setLoading(false);
      }
      console.log("Salio del request");
    };

    fetchAuthor();
  }, [id]);

  function handleAddFavoriteFromAPI(event: SyntheticEvent): void {
    // console.log("Adding author to favorites:", author);
    event.preventDefault();
    setLoading(true);
    if (onAddFavorite) {
      onAddFavorite(author as Author);
    }
    setLoading(false);
  }

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen">
      {/* <button
        onClick={() => {

          setAuthor(null);
          setAuthorWorks([]);
        }}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full transition duration-200 flex items-center gap-2"
      >
        <span className="transform rotate-180 inline-block mr-1">→</span> Back to Search
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
                              className="btn btn-outline-danger btn-md "
                              disabled={loading}
                            >
                              {loading ? 'Adding...' : <><Heart size={20} /> Add to Favorites</>}
                            </button>
                          )
                            : (
                              <button
                                onClick={handleAddFavoriteFromAPI}
                                className="btn btn-outline-danger btn-sm "
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

  );
}

export default AuthorPage;