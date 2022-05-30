import React, {useState, useEffect, Fragment} from "react";

export default function Pokes() {

  const [pokemonData, setPokemonData] = React.useState({});

  React.useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json"
    )
      .then((res) => res.json())
      .then((data) => setPokemonData(data.pokemon));
  }, []);

  const allPokes = pokemonData;
  const pokemons = Object.values(allPokes);
  console.log(pokemons)

  let renderedOutput = pokemons.map(pokemon => <div className="infodiv" style={{ flex: 1, flexBasis: "33%" }}>  <img src={pokemon.img} /> {pokemon.num} {pokemon.name}  </div>)
// Note the code change above ^^^

 return (
        <main>
          <div>

            <div style={{ display: "flex", flexWrap: "wrap" }}>{renderedOutput}</div>

          </div>
        </main>
      );
}