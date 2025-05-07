const container = document.getElementById("pokemon-container");
const button = document.getElementById("get-pokemon");

button.addEventListener("click", async () => {
  container.innerHTML = ""; // Limpia los Pokémon anteriores

    for (let i = 0; i < 6; i++) {
        const id = Math.floor(Math.random() * 898) + 1;
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();

        const name = data.name.toUpperCase();
        const image = data.sprites.front_default;
        const types = data.types.map(t => t.type.name).join(", ");

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
        <img src="${image}" alt="${name}" />
        <h3>${name}</h3>
        <p><strong>Tipo:</strong> ${types}</p>
        `;

        container.appendChild(card);
    }
    });
