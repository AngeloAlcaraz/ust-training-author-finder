import { useState, type SyntheticEvent } from "react";
import type { IAuth } from "../../Auth/iauth";
import { Auth } from "../../Auth/auth";
import { LoginErroMessage } from "../../Auth/loginErrorMessage";
import { authServiceAPI } from "../../services/auth.service";

interface LoginProps {
  onLoginSuccess: (auth: IAuth) => void;
  onLoginError: (error: string) => void;
}

function LoginPage({ onLoginSuccess, onLoginError }: LoginProps) {

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await authServiceAPI.login(username, password);
      if (response instanceof Auth)
        onLoginSuccess(response);
      else
        if (response instanceof LoginErroMessage) {
          setErrorMessage(response.message);
          onLoginError(response.message)
        }

    } catch (error) {
      setErrorMessage(error as string);
      onLoginError(error as string);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="form-group">
          <label htmlFor="username">Email/Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-label="Username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
        </div>
        <button className="login-button" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default LoginPage;