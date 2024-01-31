let pkmnInput = document.getElementById("pkmnInput");
let monName = document.getElementById("monName");
let monType = document.getElementById("monType");
let monDesc = document.getElementById("monDesc");
let monLocation = document.getElementById("monLocation");
let monAbilities = document.getElementById("monAbilities");
let monMoves = document.getElementById("monMoves");
let monImg = document.getElementById("monImg");




const mainApi = async (mon) => {
    const promise = await fetch("https://pokeapi.co/api/v2/pokemon/" + mon);
    const data = await promise.json();

    monName.textContent = "#"+ data.id + " " + data.name;
    let types = data.types.map(ele => (ele.type.name));
    monType.textContent = types.join(', ');

    monDesc.textContent = "";

    let abilities = data.abilities.map(ele => (ele.ability.name));
    monAbilities.textContent = abilities.join(', ');

    let moves = data.moves.map(ele => (ele.move.name));
    monMoves.textContent = moves.join(', ');

    monImg.src = data.sprites.other["official-artwork"].front_default;

    //this sets the location text
    monLocation.textContent = ("Not found in the wild");
    locationFetch(data);
    //fetches the data from species endpoint
    speciesFetch(data);
    return data;
}

const locationFetch = async (data) =>{
    const promise = await fetch([data.location_area_encounters]);
    const location = await promise.json();
    monLocation.textContent =(location[0].location_area.name);
    return location;
    
}
const speciesFetch = async (data) => {
    const promise = await fetch([data.species.url]);
    const species = await promise.json();
    monDesc.textContent = species.flavor_text_entries[0].flavor_text;
    console.log(species);
    evoFetch(species);
}

const evoFetch = async (data) =>{
    if (data.evolution_chain){
        const promise = await fetch([data.evolution_chain.url]);
        const evo = await promise.json();
        console.log(evo);
        if (evo.chain.evolves_to[0]){
            console.log(evo.chain.evolves_to.length);
        }
        console.log(evo.chain.evolves_to[0].evolves_to[0]);
        // console.log(evo.chain.evolves_to[0].species);
    }
    
    
}

pkmnInput.addEventListener('keydown', async (event) => {
    //On enter I want this function to run
    if (event.key === "Enter") {
        pkmn = await mainApi(event.target.value);
        console.log(pkmn.location_area_encounters);
    }
})