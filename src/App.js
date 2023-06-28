import logo from './logo.svg';
import './App.css';
import { ScoreNineProvider } from "./contexts/ScoreNineContext"
import ScoreNine from './components/ScoreNine';

function App() {
  return (
    <div className="container">
      <ScoreNineProvider>
        <ScoreNine />
      </ScoreNineProvider>
    </div>
  );
}

export default App;
