import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const [newCar, setNewCar] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    img: '',
    description: ''
  });

  const [error, setError] = useState('');

  const API_URL = "http://192.168.103.91:5005/api/cars";

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCars(data || []);
      setFilteredCars(data || []);
    } catch (error) {
      console.error("Błąd pobierania danych", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    const filtered = cars.filter((car) =>
      car.brand.toLowerCase().includes(query.toLowerCase()) ||
      car.model.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCars(filtered);
  }, [query, cars]);

  const deleteCar = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ogłoszenie?")) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      fetchCars();
    } catch (error) {
      console.error("Błąd usuwania:", error);
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();

    if (
      !newCar.brand ||
      !newCar.model ||
      !newCar.year ||
      !newCar.price ||
      !newCar.img ||
      !newCar.description
    ) {
      setError("Wszystkie pola są wymagane!");
      return;
    }

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newCar)
      });

      setNewCar({
        brand: '',
        model: '',
        year: '',
        price: '',
        img: '',
        description: ''
      });

      setError('');
      fetchCars();
    } catch (error) {
      console.error("Błąd dodawania:", error);
    }
  };

  return (
    <div className="bg-gradient min-vh-100 py-5"
      style={{ background: "linear-gradient(135deg, #1f1f1f, #2c3e50)" }}>

      <div className="container">

        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-white">Auto Marketplace</h1>
        </div>

        <div className="card p-4 mb-5 shadow">
          <h4>Dodaj nowe ogłoszenie</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleAddCar}>
            <div className="row g-3">
              {Object.keys(newCar).map((key) => (
                <div className="col-md-6" key={key}>
                  <input
                    type="text"
                    placeholder={key}
                    className="form-control"
                    value={newCar[key]}
                    onChange={(e) =>
                      setNewCar({ ...newCar, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            <button className="btn btn-success mt-3">
              Dodaj ogłoszenie
            </button>
          </form>
        </div>

        <div className="col-md-4 mb-4">
          <input
            type="text"
            placeholder="Szukaj samochodu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-control"
          />
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-light" />
          </div>
        ) : (
          <div className="row g-4">
            {filteredCars.map((car) => (
              <div key={car.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">

                <div className="card h-100 shadow-lg rounded-4 overflow-hidden">

                  <img
                    src={car.img}
                    className="card-img-top"
                    alt={car.model}
                    style={{ height: "200px", objectFit: "cover" }}
                  />

                  <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-3 px-3 py-2 fs-6 shadow"> 
                  {car.price} zł</span>
                  <div className="card-body d-flex flex-column">
                    <h5>{car.brand}</h5>
                    <p className="text-muted small">
                      {car.model} • {car.year}
                    </p>
                    <p className="small flex-grow-1">
                      {car.description}
                    </p>

                    <button
                      className="btn btn-danger"
                      onClick={() => deleteCar(car.id)}
                    >
                      Usuń
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCars.length === 0 && (
          <div className="alert alert-secondary text-center mt-4">
            Nie znaleziono ofert
          </div>
        )}

      </div>
    </div>
  );
}

export default App;