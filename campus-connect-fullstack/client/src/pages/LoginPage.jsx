import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegister) {
        await register({ name, email: identifier, password });
      } else {
        await login(identifier, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="hero-section text-center">
        <h1>{isRegister ? 'Create Account' : 'Login to Campus Connect'}</h1>
        <p>Access your account to manage events and track attendance</p>
      </header>

      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card">
              <div className="card-body p-4 p-md-5">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  {isRegister && (
                    <div className="mb-4">
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="form-control"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label">
                      Email address or Username
                    </label>
                    <input
                      type="text"
                      id="email"
                      className="form-control"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-4"
                    disabled={submitting}
                  >
                    {submitting ? 'Please wait...' : isRegister ? 'Register' : 'Sign in'}
                  </button>

                  <div className="text-center">
                    <p>
                      {isRegister ? 'Already a member?' : 'Not a member?'}{' '}
                      <button
                        type="button"
                        className="btn btn-link p-0 align-baseline"
                        onClick={() => {
                          setIsRegister(!isRegister);
                          setError('');
                        }}
                      >
                        {isRegister ? 'Sign in' : 'Register'}
                      </button>
                    </p>
                    <p className="small text-muted mb-0">
                      Or register for Nakshatra <Link to="/form">here</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

