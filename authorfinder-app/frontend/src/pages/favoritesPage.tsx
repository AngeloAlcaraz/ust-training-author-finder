import { useEffect, useState } from "react";
import { authServiceAPI } from "../services/auth.service";
import favoritesAPI from "../services/favorites.service";
import type { Favorite } from "../model/Favorite";
import AuthorCard from "../components/authors/authorCard.component";

function Favorites() {

  const [isLogin, setIsLogin] = useState(false)
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([])

  useEffect(() => {
    console.log('Validating credentials...');
    const user = authServiceAPI.getCurrentUser();

    if (user) {
      setIsLogin(true);

      const fetchFavorites = async () => {
        const response = await favoritesAPI.getFavoritesByUser("user_123")

        // console.log("RESPUESTA DE la pagina....." + response)
        // console.log("RESPUESTA DE LOS FAVORITOS....." + response)
        // console.log("AUTHOR....." + response.data)

        setFavorites(response);
      }

      fetchFavorites();
    }
    else {
      console.log('No user found.');
    }
  }, []);

  return (<>
    {
      isLogin ? (
        <>
          <ul className="list-group list-group-flush">
            <div className="row row-cols-1 row-cols-md-3 g-4 ">
              {favorites.map((favorite) => (
                <div className="col" key={favorite.authorId}>
                  <AuthorCard author={favorite.author} isFavorite={true} onfavorite={() => { }}></AuthorCard>
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