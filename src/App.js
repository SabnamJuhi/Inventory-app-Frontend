import './App.css';
import InvoicePage from './pages/InvoicePage';

function App() {
  return (
    <div className="min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="/">Inventory / Invoices</a>
        </div>
      </nav>

      <main className="py-4">
        <div className="container container-xl">
          <InvoicePage />
        </div>
      </main>
    </div>
  );
}

export default App;
