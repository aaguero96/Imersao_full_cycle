'use-client'
import { useState } from "react";

const ClickCounters = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Contador de cliques</h1>
      <h2>Numero de cliques: {count}</h2>
      <button
        onClick={() => {
          setCount(count + 1)
        }}
      >
        Increment
      </button>
    </div>
  )
}

export default ClickCounters;


