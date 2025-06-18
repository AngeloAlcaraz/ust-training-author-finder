import { useState, type SyntheticEvent } from "react";
import { authServiceAPI } from "../../services/auth.service";
import type { IAuth } from "../../Auth/iauth";
import { Auth } from "../../Auth/auth";
import { LoginErroMessage } from "../../Auth/loginErrorMessage";

interface LoginProps {
  onLoginSuccess: (auth: IAuth) => void;
  onLoginError: (error: string) => void;
}

function RegisterPage({ onLoginSuccess, onLoginError }: LoginProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await authServiceAPI.register(name, email, password);
      if (response instanceof Auth)
        onLoginSuccess(response);
      else
        if (response instanceof LoginErroMessage) {
          setErrorMessage(response.message);
          onLoginError(response.message)
        }

    }
    catch (error) {
      setErrorMessage(error as string);

    }
    finally {
      setLoading(false);
    }
  }

  return (<div className="login-container">
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Sing up</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-label="name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email"
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
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  </div>)
}

export default RegisterPage;