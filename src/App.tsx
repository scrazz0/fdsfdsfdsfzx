import React, { useState, useEffect } from 'react';
import './App.css';

interface Property {
  id: number;
  title: string;
  price: string;
  image: string;
}

const API_URL = 'http://localhost:3001';
const WS_URL = 'ws://localhost:3001';

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    // WebSocket для обновлений в реальном времени
    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'initial') {
        setProperties(message.data);
      } else if (message.type === 'new_property') {
        setProperties(prev => [...prev, message.data]);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const handlePaymentClick = async () => {
    try {
      await fetch(`${API_URL}/log-payment`, { method: 'POST' });
      alert('Спасибо! Ваш запрос на пополнение обрабатывается.');
    } catch (error) {
      console.error('Ошибка при логировании:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Каталог недвижимости</h1>
        <button className="payment-button" onClick={handlePaymentClick}>
          Пополнить баланс
        </button>
      </header>
      
      <main className="property-grid">
        {properties.map(prop => (
          <div key={prop.id} className="property-card">
            <img src={prop.image} alt={prop.title} className="property-image" />
            <div className="property-info">
              <h3>{prop.title}</h3>
              <p>{prop.price}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default App;