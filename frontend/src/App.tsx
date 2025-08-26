import { UserManager } from './components/UserManager';
import { Header } from './components/Header';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <UserManager />
      </main>
    </div>
  );
}

export default App;
