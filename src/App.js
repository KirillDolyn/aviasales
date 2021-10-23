import React from 'react';
import logoSvg from './img/Logo.svg'; 
// import checkOn from './img/checkbox-on.svg'; 
// import checkOff from './img/checkbox-off.svg';
 import { ticketNorma } from './helper';
import './App.css';

const LOW_PRICE ="lowprice"
const FASTERS ="fasters"

function App() {
  const [searchId, setSeachId] = React.useState()
  const [tickets, setTickets] = React.useState([])
  const [stop, setStop] = React.useState(false)
  const [filterTickets, setFilterTickets] = React.useState([])
  const [filter, setFilter] = React.useState({all: true, without: false, one: false, two: false, three: false})
  const [sort, setSort] = React.useState({sorted: LOW_PRICE})

  const [sortActive, setSortActive] = React.useState({lowprice: true, fasters: false, opti: false})

  const allSort = React.useCallback((ticketses) => {
    const mTickets = [...ticketses];
    if (sortActive.lowprice) {
      return mTickets.sort((a, b) => a.price - b.price)
    }
    // if (sortActive.opti) {
    //   return mTickets.sort((a, b) => a.date - b.date)
    //}
    if (sortActive.fasters) {
      return mTickets.sort((a, b) => {
        return a.segments[0].duration + a.segments[1].duration - b.segments[0].
        duration + b.segments[1].duration
      })
  
    }
  
    return mTickets;
  }, [sortActive])

  const sortTickets = React.useCallback(
    (tickArr) => {
   return tickArr.filter((current) => {
     if (filter.all) return current;
     if ( filter.without && current.segments[0].stops.length === 0 && current.segments[1].stops.length === 0)
     return true;
     if ( filter.one && current.segments[0].stops.length === 1 && current.segments[1].stops.length === 1)
     return true;
     if ( filter.two && current.segments[0].stops.length === 2 && current.segments[1].stops.length === 2)
     return true;
     if ( filter.three && current.segments[0].stops.length === 3 && current.segments[1].stops.length === 3)
     return true;
     return false;
   })
 }, [filter])

  React.useEffect(() => {
    if (stop === true) {
      setFilterTickets(ticketNorma(allSort(sortTickets(tickets)).slice(0, 4)));
    }
  }, [stop, tickets, sortActive, allSort])


  
  React.useEffect(() => {
    fetch("https://front-test.beta.aviasales.ru/search")
    .then((res) => res.json())
    .then((res) => setSeachId(res.searchId))
    .catch((e) => console.log(e))
  }, [])

  React.useEffect(() => {
    if (searchId && stop === false ) {
    function subscribe() {
      fetch(`https://front-test.beta.aviasales.ru/tickets?searchId=${searchId}`)
      .then((data) => {
        if (data.status === 500) {
          subscribe();
        } else {
      return data.json()
        }

      })
      .then((ticketsPar) => {
        console.log("ticketsPar:", ticketsPar);
        if (ticketsPar.stop) {
          setStop(true); 
         } 
          setTickets([...tickets, ...ticketsPar.tickets])
        })
        .catch((e) => {
          console.log(e)
        });
      }
      subscribe();
    }
  }, [searchId, tickets, stop])

  const sorterHand = React.useCallback((sortedBut) => {
      if(sortedBut === sort.sorted)
      return;
      setSortActive({lowprice: !sortActive["lowprice"], fasters: !sortActive["fasters"], opti: !sortActive["opti"]})   
    },[])

    const allHandler = () => {
      if(!filter.all) {
        setFilter({all: true, without: true, one: true, two: true, three: true})
      } else {
        setFilter({all: false, without: false, one: false, two: false, three: false})

      }
    }
  return (
    <div className="App">
      <div className="app-wrapper">
        <div className="header">
          <img src={logoSvg} alt="logo" />
        </div>
        <div className="home">
          <div className="plug">
            <div className="sidebar">
              <h3>Количество пересадок</h3>
              <form>
                <label>
                  <input className="input hidden" type="checkbox" 
                  onChange={() => allHandler()}
                  checked={filter.all}
                  />
                  <span className="checket"></span>
                  Все
                </label>
                <label>
                  <input className="input hidden" type="checkbox" 
                  onChange={() => setFilter({...filter, without: !filter.without})}
                  checked={filter.without}

                  />
                  <span className="checket"></span>
                  Без пересадок
                </label>
                <label>
                  <input className="input hidden" type="checkbox" 
                  onChange={() => setFilter({...filter, one: !filter.one})}
                  checked={filter.one}

                  />
                  <span className="checket"></span>1 пересадка
                </label>
                <label>
                  <input className="input hidden" type="checkbox" 
                  onChange={() => setFilter({...filter, two: !filter.two})}
                  checked={filter.two}

                  />
                  <span className="checket"></span>2 пересадки
                </label>
                <label>
                  <input className="input hidden" type="checkbox" 
                  onChange={() => setFilter({...filter, three: !filter.three})}
                  checked={filter.three}

                  />
                  <span className="checket"></span>3 пересадки
                </label>
              </form>
            </div>
          </div>

          <div className="filter">
            <div
              onClick={() => sorterHand("lowrice")}
              className={`filter__elem filter__lowprice ${sortActive.lowprice ? "filter__elem__active" : ""}`}>
              Самый дешевый
            </div>
            <div onClick={() => sorterHand("fasters")}
              className={`filter__elem filter__fasters ${sortActive.fasters ? "filter__elem__active" : ""}`}>Самый быстрый</div>
            <div onClick={() => sorterHand("opti")}
              className={`filter__elem filter__optimal ${sortActive.opti ? "filter__elem__active" : ""}`}>Оптимальный</div>
          </div>
          <div className="tickets">
            {filterTickets.map(({ id, price, carrier, segments }) => (
              <div className="ticket" key={id}>
                <div className="ticket__header">
                  <div className="ticket__price">{price}</div>
                  <div className="ticket__logo">
                    <img src={carrier} alt="dd" />
                  </div>
                </div>
                <div className="ticket_data-wrapper">
                  {segments.map(
                    ({ id, out, outTime, timeIn, stops, stopsC }) => (
                      <div className="ticket_data" key={id}>
                        <div className="ticket_data__item">
                          <p сlassName="ticket_data__item__grey">{out}</p>
                          <p>{outTime}</p>
                        </div>
                        <div className="ticket_data__item">
                          <p сlassName="ticket_data__item__grey">В пути</p>
                          <p>{timeIn}</p>
                        </div>
                        <div className="ticket_data__item">
                          <p сlassName="ticket_data__item__grey">{stops}</p>
                          <p>{stopsC}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
