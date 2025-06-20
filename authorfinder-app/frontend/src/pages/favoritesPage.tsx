import { useEffect, useState, type SyntheticEvent } from "react";
import { authServiceAPI } from "../services/auth.service";
import favoritesAPI from "../services/favorites.service";
import type { Favorite } from "../model/Favorite";
import AuthorCard from "../components/authors/authorCard.component";
import LoadingSpinner from "../components/share/loadingSpinner.component";
import { isRouteErrorResponse } from "react-router";
import type { Author } from "../model/Author";

interface AuthorPageProps {
  isFavoriteFromServer?: boolean;
  onAddFavorite: (author: Author) => void;
}

function Favorites(props: AuthorPageProps) {

  const { isFavoriteFromServer, onAddFavorite } = props;

  const [isLogin, setIsLogin] = useState(false)
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([])

  useEffect(() => {
    setLoading(true);
    console.log('Validating credentials...');
    const user = authServiceAPI.getCurrentUser();

    const fetchFavorites = async () => {
      try {
        console.log("USUARIO:" + user.data.userId);
        const response = await favoritesAPI.getFavoritesByUser("user_123")
        setFavorites(response);
      }
      catch (e) {

      }
      finally {
        setLoading(false);
      }

    }

    if (user) {
      setIsLogin(true);
      fetchFavorites();
    }
    else {
      console.log('No user found.');
      setLoading(false)
    }


  }, []);

  // function handleAddFavoriteFromAPI(event: SyntheticEvent): void {
  //   // console.log("Adding author to favorites:", author);
  //   event.preventDefault();
  //   setLoading(true);
  //   setIsFavorite(isFavorite => !isFavorite);
  //   if (onAddFavorite) {
  //     onAddFavorite(author as Author);
  //   }
  //   setLoading(false);
  // }

  return (<>

    {
      isLogin ? (
        <>
          {loading && <LoadingSpinner />}
          <ul className="list-group list-group-flush">
            <div className="row row-cols-1 row-cols-md-3 g-4 ">
              {favorites.map((favorite) => (
                <div className="col" key={favorite.authorId}>
                  <AuthorCard author={favorite.author} isFavorite={isFavoriteFromServer} onfavorite={onAddFavorite}></AuthorCard>
                </div>
              ))}
            </div>
          </ul>
        </>
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


  </>)
}

export default Favorites;