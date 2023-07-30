import logo from './logo.svg';
import './App.css';
import CarRentalApp from './components/CarRentalApp';
import ErrorBoundary from './components/ErrorBoundary';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
        <ErrorBoundary>
          <CarRentalApp></CarRentalApp>
        </ErrorBoundary>
      </div>

    </LocalizationProvider>
  );
}

export default App;
