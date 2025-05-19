import React , {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

  

export default function Page1() {
  const [countryName, setCountryName] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCountryName(e.target.value);
  };

  const searchCountry = async () => {
    if (!countryName.trim()) {
      setError('Please enter a country name.');
      setResult([]);
      
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
      if (!response.ok) {
        throw new Error('Country not found');
      }
      const data = await response.json();

      const countryFound = data[0]?.name?.common?.toLowerCase();

      if (countryFound === 'israel') {
        setError('Access to information about this country is restricted.');
        setResult([]);
        return;
      }
      
      setResult(data);
    } catch (err) {
      setResult([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (currencies) => {
    if (!currencies) return 'N/A';
    return Object.values(currencies)
      .map((currency) => `${currency.name} (${currency.symbol})`)
      .join(', ');
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Know Your Country</h2>

      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter country name"
              value={countryName}
              onChange={handleChange}
            />
            <button className="btn btn-primary" onClick={searchCountry}>
              Search
            </button>
          </div>
          {error && <div className="text-danger mt-2">{error}</div>}
        </div>
      </div>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="row">
        {result.map((country) => (
          
          
          <div className="col-md-6 col-lg-4 mb-4" key={country.cca3}>
            <div className="card h-100 shadow-sm">
              <img
                src={country.flags.svg}
                alt={`Flag of ${country.name.common}`}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{country.name.common}</h5>
                <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
                <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                <p><strong>Time Zone:</strong> {country.timezones.join(', ')}</p>
                <p><strong>Currency:</strong> {formatCurrency(country.currencies)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
