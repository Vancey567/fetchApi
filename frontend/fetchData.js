display = (pokemons) => {

    let overlayIndex = pokemons.length;

    let pokeString = "";
    // console.log("disp");
    pokemons.map((pokemon, index) => {
        pokeString += `
        <div class="pokemon">
            <div class="overlay" style="z-index: ${overlayIndex}">
                <div class="card-details" style="padding: 30px 15px; display:flex; justify-content: space-betweeen;">
                    <div>
                        <h1>${pokemon.name}</h1>
                        <h1>${pokemon.type}</h1>
                    </div>
                    <i class="fas fa-trash-alt icon" onclick="deletePokemon('${pokemon._id}')"></i>
                </div>
            </div>
            <div class="more" style="z-index: ${overlayIndex - 1}">
                <div class="details" >
                    <p style="width: 40%; padding: 10px 0">
                        HP: ${pokemon.base.Hp}
                    </p>
                    <p style="width: 40%">
                        Attack: ${pokemon.base.Attack}
                    </p>
                    <p style="width: 40%">
                        Defense: ${pokemon.base.Defense}
                    </p>
                    <p style="width: 40%">
                        Speed: ${pokemon.base.Speed}
                    </p>
                </div>
            </div>
        </div>
        `;

        overlayIndex--;
    })
    // console.log(pokeString + "hsdd");
    document.getElementById("pokemons").innerHTML = pokeString;
}


let allPokemons = [];

// fetch/Load Already existing pokemons in the DB for the first time
fetch('http://localhost:8000/pokemons')
.then((res) => {
    return res.json();
}).then((pokemons) => {
    allPokemons = pokemons; // Sare already existing pokemons ko allPokemons array me daal do
    display(pokemons);
    // display(allPokemons);
}).catch((err) => {
    console.log(err);
})

addPokemon = () => {
    // You can't create multiple dynamic propeties like pokemon.base.Attack so for that create a base:{} inside pokemons:{}
    let pokemon = {base : {}};

    pokemon.name = document.getElementById('name').value;
    pokemon.type = document.getElementById('type').value;
    pokemon.base.Hp = document.getElementById('HP').value;
    pokemon.base.Attack = document.getElementById('Attack').value;
    pokemon.base.Defense = document.getElementById('Defense').value;
    pokemon.base.Speed = document.getElementById('Speed').value;

    // console.log(pokemon);

    fetch("http://localhost:8000/pokemons", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pokemon)
    } )
    .then((res) => {
        return res.json();
    }).then ((pokemon) => {
        document.getElementById('addForm').reset();
        allPokemons.push(pokemon);
        display(allPokemons);

        toast("Pokemon Created");
    }).catch((err) => {
        console.log(err);
    })
} 

deletePokemon = (id) => {
    console.log(id);
    fetch(`http://localhost:8000/pokemons/${id}`, {
        method: "DELETE",
    })
    .then((res) => {
        return res.json();
    }).then ((data) => {
        // On the frontend You will have to find the index of the element deleted from the backend and splice that single element from the array
        let indexOfDeletePokemon = allPokemons.findIndex(p => p._id === id);
        allPokemons.splice(indexOfDeletePokemon, 1);

        // Again display that array after removing the element from the array 
        display(allPokemons);

        // Call the toast function
        toast("Pokemon Deleted");

    }).catch((err) => {
        console.log(err);
    })
}

toast = (message) => {
    document.getElementById('toast').style.display = "block";
    document.getElementById('message').innerText = message;

    // Hide toast after 5 seconds
    setTimeout(() => {
        document.getElementById('toast').style.display = "none";
    }, 5000)
}