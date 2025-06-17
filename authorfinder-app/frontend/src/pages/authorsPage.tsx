import { useRef, useState, type SyntheticEvent } from "react";
import { Search, Heart, ListPlus, Book, Pencil, Trash2, X, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from "react-router";

function AuthorsPage() {
  const [view, setView] = useState('browse'); // 'browse', 'authorDetails', 'favorites', 'addEditFavorite', 'similarAuthors'
  type Author = {
    cover_id: any;
    key: string;
    name: string;
    top_work?: string;
    // Add other properties as needed
  };

  const [searchResults, setSearchResults] = useState<Author[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null); // Full author object from Open Library
  const [authorWorks, setAuthorWorks] = useState([]);
  const [similarAuthors, setSimilarAuthors] = useState([]); // Stores LLM-generated similar authors
  const [currentAuthorForRec, setCurrentAuthorForRec] = useState(null); // Author name for whom recommendations are shown

  const [message, setMessage] = useState(''); // For message box
  const [messageType, setMessageType] = useState('info'); // 'info', 'error', 'success', 'confirm'
  const [showMessageBox, setShowMessageBox] = useState(false);

  const messageBoxTimeoutRef = useRef(null);
  const confirmPromiseResolve = useRef<((confirmed: boolean) => void) | null>(null); // To handle message box confirmations


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!searchText.trim()) {
      showMessage('Please enter an author name to search.', 'info');
      return;
    }

    setLoading(true);
    setSearchResults([]);
    setSelectedAuthor(null);
    setAuthorWorks([]);
    setSimilarAuthors([]); // Clear recommendations
    setCurrentAuthorForRec(null); // Clear recommendations target

    try {
      const response = await fetch(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(searchText)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Search Results:", data.docs);
      setSearchResults(data.docs || []);
      if (data.docs.length === 0) {
        showMessage('No authors found for your search query.', 'info');
      }
    } catch (error) {
      console.error("Error searching authors:", error);
      showMessage('Failed to search authors. Please check your internet connection or try again later.', 'error');
    } finally {
      setLoading(false);
      setView('browse');
    }
  };

  //! Service to fetch author by id, this should be work for details page 
  const fetchAuthorDetails = async (authorKey: any) => {
    setLoading(true);
    try {
      // Fetch author details
      const authorResponse = await fetch(`https://openlibrary.org/authors/${authorKey}.json`);
      if (!authorResponse.ok) throw new Error(`Failed to fetch author details: ${authorResponse.status}`);
      const authorData = await authorResponse.json();
      console.log("Author Data:", authorData);


      // Fetch author's works
      const worksResponse = await fetch(`https://openlibrary.org/authors/${authorKey}/works.json`);
      if (!worksResponse.ok) throw new Error(`Failed to fetch author works: ${worksResponse.status}`);
      const worksData = await worksResponse.json();
      setAuthorWorks(worksData.entries || []);
      setView('authorDetails');
    } catch (error) {
      console.error("Error fetching author details/works:", error);
      showMessage('Failed to load author details and books. Please try again.', 'error');
      setView('browse'); // Go back to browse if details fail
    } finally {
      setLoading(false);
    }
  };



  const handleMessageBoxAction = (action: string) => {
    setShowMessageBox(false);
    if (confirmPromiseResolve.current) {
      confirmPromiseResolve.current(action === 'confirm');
      confirmPromiseResolve.current = null; // Clear the resolver
    }
  };

  //* Share Component
  const showMessage = (msg: string, type = 'info', duration = 3000) => {
    setMessage(msg);
    setMessageType(type);
    setShowMessageBox(true);

    if (messageBoxTimeoutRef.current) {
      clearTimeout(messageBoxTimeoutRef.current);
    }
    // Only set timeout if it's not a confirmation message
    if (type !== 'confirm') {
      messageBoxTimeoutRef.current ?? setTimeout(() => {
        setShowMessageBox(false);
      }, duration);
    }
  };

  //* Share Component
  const MessageBox = ({ message, type, onClose }: { message: string; type: string; onClose: () => void }) => {
    let bgColor, textColor, icon;
    switch (type) {
      case 'success':
        bgColor = 'alert alert-success';
        textColor = 'text-black';
        icon = '✅';
        break;
      case 'error':
        bgColor = 'alert alert-danger';
        textColor = 'text-black';
        icon = <AlertCircle size={24} className="text-black" />;
        break;
      case 'info':
        bgColor = 'alert alert-primary';
        textColor = 'text-black';
        icon = 'ℹ️';
        break;
      case 'confirm':
        bgColor = 'alert alert-warning';
        textColor = 'text-black';
        icon = '⚠️';
        return (
          <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-xl flex flex-col items-start gap-3 z-[100] ${bgColor} text-primary-emphasis`}>
            <div className="flex items-center gap-3 w-full">
              <div className="text-2xl">{icon}</div>
              <p className="font-semibold flex-grow">{message}</p>
              <button onClick={() => handleMessageBoxAction('cancel')} className="ml-auto text-black hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <div className="flex justify-end w-full gap-2 mt-2">
              <button
                onClick={() => handleMessageBoxAction('confirm')}
                className="bg-white text-yellow-700 font-semibold py-1 px-3 rounded-md hover:bg-gray-100 transition duration-150"
              >
                Yes
              </button>
              <button
                onClick={() => handleMessageBoxAction('cancel')}
                className="bg-yellow-700 text-black font-semibold py-1 px-3 rounded-md hover:bg-yellow-800 transition duration-150"
              >
                No
              </button>
            </div>
          </div>
        );
      default:
        bgColor = 'alert alert-secondary';
        textColor = 'text-black';
        icon = '💬';
    }

    return (

      // <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
      //   <div className="toast-header">
      //     {/* <img src="..." className="rounded me-2" alt="..."> */}
      //     <strong className="me-auto">Bootstrap</strong>
      //     <small>11 mins ago</small>
      //     <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      //   </div>
      //   <div className="toast-body">
      //     Hello, world! This is a toast message.
      //   </div>
      // </div>

      // <div className="alert alert-primary" role="alert">
      //   A simple primary alert—check it out!
      // </div>


      <div className={` ${bgColor} text-primary-emphasis`}>
        <div className="text-2xl">{icon}</div>
        <p className="font-semibold">{message}</p>
      </div>
    );
  };

  //* Share Component
  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center">
      <div className="spinner-border text-primary " style={{ width: "4rem", height: "4rem" }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );


  return (
    <>

      <div className="">
        {/* <div className="row"> */}
        <div className="col-12 mb-2">
          <h2 className="mb-6 text-center">
            Explore Authors
          </h2>
        </div>
        {/* </div> */}

        <div className=" text-center">
          <div className="row container justify-content-center">
            <div className="col-8">
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
                <div className="input-group mb-3">

                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search author by name (e.g., 'Jane Austen')"
                    className="form-control"
                  />

                  <button
                    type="submit"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={loading}
                  >
                    {loading ? 'Searching...' : <><Search size={20} /> Search</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {showMessageBox && (
          <MessageBox
            message={message}
            type={messageType}
            onClose={() => handleMessageBoxAction('cancel')} // Allow closing info/error/success boxes
          />
        )}

        {searchResults.length > 0 && (
          <div className="shadow-lg rounded-lg p-4 bg-white">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">Search Results</h3>
            <ul className="list-group list-group-flush">
              {searchResults.map((author) => (
                <li key={author.key} className="list-group-item">

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
                      <button className="btn btn-outline-danger btn-md text-decoration-none">
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
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>



      {loading && <LoadingSpinner />}
    </>
  );
}

export default AuthorsPage;