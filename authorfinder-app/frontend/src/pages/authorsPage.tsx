import { useRef, useState, type SyntheticEvent } from "react";
import { Search, Heart, ListPlus, Book, Pencil, Trash2, X, AlertCircle, Sparkles } from 'lucide-react';
import MessageBox from "../components/share/message.component";
import { Link } from "react-router";
import LoadingSpinner from "../components/share/loadingSpinner.component";
import type { Author } from "../model/Author";
import AuthorLi from "../components/authors/authorLi.component";
import AuthorCard from "../components/authors/authorCard.component";
import authorAPI from "../services/author.service";
import useIsMobile from "../hooks/useIsMobil";

function AuthorsPage() {

  const isMobile = useIsMobile();


  const [view, setView] = useState('browse'); // 'browse', 'authorDetails', 'favorites', 'addEditFavorite', 'similarAuthors'

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
      setView('browse');
    }
  };

  //! Service to fetch author by id, this should be work for details page 
  const fetchAuthorDetails = async (authorKey: any) => {
    setLoading(true);
    try {
      // Fetch author details
      // const authorResponse = await fetch(`https://openlibrary.org/authors/${authorKey}.json`);
      // if (!authorResponse.ok) throw new Error(`Failed to fetch author details: ${authorResponse.status}`);
      // const authorData = await authorResponse.json();
      // console.log("Author Data:", authorData);


      // // Fetch author's works
      // const worksResponse = await fetch(`https://openlibrary.org/authors/${authorKey}/works.json`);
      // if (!worksResponse.ok) throw new Error(`Failed to fetch author works: ${worksResponse.status}`);
      // const worksData = await worksResponse.json();

      const data = await authorAPI.getAuthorById(authorKey);
      setAuthorWorks(data);
      //! deberia navegarse a la pagina de detalles del autor
      //setView('authorDetails');
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
          onMessageBoxAction={() => handleMessageBoxAction} // Allow closing info/error/success boxes
        />
      )}

      {searchResults.length > 0 && (
        <div className="shadow-lg rounded-lg p-4 bg-white">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">Search Results</h3>

          {isMobile && (
            <ul className="list-group list-group-flush">
              {searchResults.map((author) => (
                <AuthorLi author={author}></AuthorLi>
              ))}
            </ul>
          )}

          {!isMobile && (
            <ul className="list-group list-group-flush">
              <div className="row row-cols-1 row-cols-md-3 g-4 ">
                {searchResults.map((author) => (
                  <AuthorCard author={author}></AuthorCard>
                ))}
              </div>
            </ul>
          )}
        </div>
      )}

      {loading && <LoadingSpinner />}
    </>
  );
}

export default AuthorsPage;