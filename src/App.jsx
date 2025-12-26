import { useState, useEffect } from 'react'

function App() {

  const makeCells = (size) => {
    let obj = {};
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let neigh = [];
        const up = y - 1;
        const down = y + 1
        const lt = x - 1;
        const rt = x + 1;
        if (x > 0) {
          neigh.push(`${lt},${y}`)
          if (y > 0) {
            neigh.push(`${lt},${up}`)
          }
          if (y < size - 1) {
            neigh.push(`${lt},${down}`)
          }
        }
        if (y > 0) {
          neigh.push(`${x},${up}`)
        }
        if (y < size - 1) {
          neigh.push(`${x},${down}`)
        }
        if (x < size - 1) {
          neigh.push(`${rt},${y}`)
          if (y > 0) {
            neigh.push(`${rt},${up}`)
          }
          if (y < size - 1) {
            neigh.push(`${rt},${down}`)
          }
        }
        obj[`${x},${y}`] = {
          x, y, state: false, neigh
        };
      }
    }
    return obj;
  }

  const [cells, setCells] = useState(makeCells(50));
  const [generating, setGenerating] = useState(false);

  const toggle = (id) => {
    setCells(prev => {
      prev[id].state = !prev[id].state;
      return { ...prev }
    })
  }

  const random = () => {
    let obj = {}
    setCells(prev => {
      Object.keys(prev).forEach(k => {
        obj[k] = { ...prev[k], state: !Math.floor(Math.random() * 3) }
      });
      return obj;
    })
  }

  const getStatus = (id, myCells) => {
    const cell = myCells[id];
    const score = cell.neigh.reduce((acc, e) => {
      return myCells[e].state ? acc + 1 : acc
    }, 0)
    if (cell.state && (score < 2 || score > 3)) {
      return { ...cell, state: false };
    }
    if (!cell.state && score === 3) {
      return { ...cell, state: true };
    }
    else {
      return cell
    }
  }

  const generate = () => {
    setGenerating(prev => !prev)
  }

  useEffect(() => {
    if (!generating) {
      return;
    }
    const interval = setInterval(() => {
      setCells(prev => {
        let obj = {};
        Object.keys(prev).forEach(k => {
          obj[k] = getStatus(k, prev);
        })
        return obj;
      })
    }, 100);
    return () => clearInterval(interval);
  }, [generating]);

  const clear = () => {
    setGenerating(false)
    setCells(makeCells(50))
  }

  return (
    <>
      <h1>Game of life</h1>
      <button className="mb-2 me-1" type="button" onClick={clear}>Clear</button>
      <button className="mb-2 me-1" type="button" onClick={random}>Randomize</button>
      <button className="mb-2 me-1" type="button" onClick={generate}>{generating ? "Stop" : "Generate"}</button>
      <div className="button-container">
        {Object.entries(cells).map(([k, v]) =>
          <button key={k} onClick={() => toggle(k)} className={v.state ? "alive" : "dead"}>&nbsp;</button>
        )}
      </div >
    </>
  )
}

export default App
