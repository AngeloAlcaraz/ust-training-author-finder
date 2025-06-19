import { useRef, useState, type SyntheticEvent } from "react";
import { Search } from 'lucide-react';
import MessageBox from "../components/share/message.component";
import LoadingSpinner from "../components/share/loadingSpinner.component";
import type { Author } from "../model/Author";
import AuthorLi from "../components/authors/authorLi.component";
import AuthorCard from "../components/authors/authorCard.component";
import authorAPI from "../services/author.service";
import useIsMobile from "../hooks/useIsMobil";
// import Pagination from "../components/share/pagination.component";

interface AuthorsPageProps {
  onAddFavorite: (author: Author) => void;
}


function AuthorsPage(props: AuthorsPageProps) {

  const { onAddFavorite } = props;

  const isMobile = useIsMobile();
  // const authorsPerPage = 6; // Number of authors to display per page

  const [searchResults, setSearchResults] = useState<Author[]>([]);

  const [message, setMessage] = useState(''); // For message box
  const [messageType, setMessageType] = useState('info'); // 'info', 'error', 'success', 'confirm'
  const [showMessageBox, setShowMessageBox] = useState(false);

  const messageBoxTimeoutRef = useRef(null);
  const confirmPromiseResolve = useRef<((confirmed: boolean) => void) | null>(null); // To handle message box confirmations


  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | undefined>(undefined);

  const [searchText, setSearchText] = useState('');
  // const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!searchText.trim()) {
      showMessage('Please enter an author name to search.', 'info');
      return;
    }

    setLoading(true);
    setSearchResults([]);

    //Call data service to search authors by name
    try {
      const data = await authorAPI.getAuthorsByName(searchText.trim());

      setSearchResults(data || []);
      if (data.length === 0) {
        showMessage("No authors found for your search query.", "info");
      }
    } catch (error) {
      console.error("Error searching authors:", error);
      showMessage('Failed to search authors. Please check your internet connection or try again later.', 'error');
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

  //* Show message box with auto-hide functionality
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

  // const paginatedAllAuthors = useMemo(() => {
  //   const startIndex = (allAuthorsPage - 1) * authorsPerPage;
  //   const endIndex = startIndex + authorsPerPage;
  //   return searchResults.slice(startIndex, endIndex);
  // }, [allAuthorsPage]);

  // const totalAllAuthorsPages = useMemo(() => {
  //   return Math.ceil(searchResults.length / authorsPerPage);
  // }, []);

  return (
    <>
      <div className="col-12 mb-2">
        <h2 className="mb-6 text-center">
          Explore Authors
        </h2>
      </div>

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
                  className="btn btn-outline-primary btn-sm"
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
          onMessageBoxAction={() => handleMessageBoxAction} // Allow closing info/error/success boxes
        />
      )}

      {searchResults.length > 0 && (
        <div className="shadow-lg rounded-lg p-4 bg-white">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">Search Results</h3>

          {isMobile && (<>

            <ul className="list-group list-group-flush">
              {searchResults.map((author) => (
                <li key={author.key} className="list-group-item">
                  <AuthorLi author={author} onfavorite={onAddFavorite}></AuthorLi>
                </li>

              ))}
            </ul>
            {/* <Pagination
              currentPage={allAuthorsPage}
              totalPages={totalAllAuthorsPages}
              onPageChange={setAllAuthorsPage}
            /> */}
          </>

          )}

          {!isMobile && (
            <>
              <ul className="list-group list-group-flush">
                <div className="row row-cols-1 row-cols-md-3 g-4 ">
                  {searchResults.map((author) => (
                    <div className="col" key={author.key}>
                      <AuthorCard author={author} onfavorite={onAddFavorite}></AuthorCard>
                    </div>
                  ))}
                </div>
              </ul>
              {/* <Pagination
                currentPage={allAuthorsPage}
                totalPages={totalAllAuthorsPages}
                onPageChange={setAllAuthorsPage}
              /> */}

            </>

          )}
        </div>
      )}


      {loading && <LoadingSpinner />}
    </>
  );
}

export default AuthorsPage;