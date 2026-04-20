import { useEffect, useState } from 'react'
import './App.css'

// Предположим, картинки импортируются правильно
import image1 from './assets/1.jpg' 
import image2 from './assets/2.jpg'
import image3 from './assets/3.jpg'
import image4 from './assets/4.jpg'

function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // Называем единообразно

  const cardsData = [
    { id: 1, value: image1 },
    { id: 2, value: image2 },
    { id: 3, value: image3 },
    { id: 4, value: image4 }
  ];

  const shuffleCards = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Инициализация игры
  useEffect(() => {
    const duplicated = [...cardsData, ...cardsData];
    const shuffled = shuffleCards(duplicated).map((card, index) => ({
      ...card,
      uniqueId: index,
      isFlipped: false,
      isMatched: false
    }));
    setCards(shuffled);
  }, []);

  const handleFlip = (uniqueId) => {
    // Не даем перевернуть больше 2 карт или уже открытую карту
    if (flipped.length === 2) return;
    const card = cards.find(c => c.uniqueId === uniqueId);
    if (card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c =>
      c.uniqueId === uniqueId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    setFlipped(prev => [...prev, uniqueId]);
  };

  // Проверка совпадения
  useEffect(() => {
    if (flipped.length !== 2) return;

    const [firstId, secondId] = flipped;
    const firstCard = cards.find(c => c.uniqueId === firstId);
    const secondCard = cards.find(c => c.uniqueId === secondId);

    if (firstCard.value === secondCard.value) {
      // Совпадение найдено
      setCards(prev =>
        prev.map(card =>
          card.value === firstCard.value ? { ...card, isMatched: true } : card
        )
      );
      setFlipped([]);
    } else {
      // Не совпало — переворачиваем обратно через 800мс
      setTimeout(() => {
        setCards(prev =>
          prev.map(card =>
            card.uniqueId === firstId || card.uniqueId === secondId
              ? { ...card, isFlipped: false }
              : card
          )
        );
        setFlipped([]);
      }, 800);
    }
  }, [flipped]); // Зависимость от массива перевернутых карт

  return (
    <div className="container">
      <h1 className='title'>Memory Game</h1>
      <div className='grid'>
        {cards.map(card => (
          <div
            key={card.uniqueId}
            className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
            onClick={() => handleFlip(card.uniqueId)}
          >
            <div className="inner">
              <div className="front">?</div>
              <div className="back">
                <img src={card.value} alt="icon" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;