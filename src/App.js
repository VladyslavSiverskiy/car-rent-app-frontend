import logo from './logo.svg';
import './App.css';
import CarRentalApp from './components/CarRentalApp';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
     <div className="App">
        <ErrorBoundary>
          <CarRentalApp></CarRentalApp>
        </ErrorBoundary>
      </div>
  );
}

export default App;
