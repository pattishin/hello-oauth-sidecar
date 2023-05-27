import './App.css';
import auth from './utils/auth.js';

function App() {

  function onLoginClick(event) {
    event?.preventDefault();
    auth?.login();
  };

  return (
    <div className="App">
      <button
        className="login"
        onClick={onLoginClick}
      >
        Login
      </button>
    </div>
  );
}

export default App;
