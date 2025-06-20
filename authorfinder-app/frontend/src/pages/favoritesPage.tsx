import { useEffect, useState } from "react";
import { authServiceAPI } from "../services/auth.service";
import favoritesAPI from "../services/favorites.service";
import type { Favorite } from "../model/favorite";

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

        console.log("RESPUESTA DE LOS FAVORITOS....." + response)
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
        <></>
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