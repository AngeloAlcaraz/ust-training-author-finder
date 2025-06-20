import { useEffect, useState } from "react";
import { authServiceAPI } from "../services/auth.service";

function Favorites() {

  const [isLogin, setIsLogin] = useState(false)
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Validating credentials...');
    const user = authServiceAPI.getCurrentUser();

    if (user) {
      setIsLogin(true);
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