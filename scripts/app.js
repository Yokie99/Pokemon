let pkmnInput = document.getElementById("pkmnInput");
let monName = document.getElementById("monName");
let monType = document.getElementById("monType");
let monDesc = document.getElementById("monDesc");
let monLocation = document.getElementById("monLocation");
let monAbilities = document.getElementById("monAbilities");
let monMoves = document.getElementById("monMoves");
let monImg = document.getElementById("monImg");

let evoDiv = document.getElementById("evoDiv");
let evoDiv2 = document.getElementById("evoDiv2");
let evoDiv3 = document.getElementById("evoDiv3");
let evoCount = 0;


const mainApi = async (mon) => {
    evoDiv.textContent = "";
    evoDiv2.textContent = "";
    evoDiv3.textContent = "";
    evoCount = 0;
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
    for(let i =0; i<species.flavor_text_entries.length; i++){
        if (species.flavor_text_entries[i].language.name == "en"){
            monDesc.textContent = species.flavor_text_entries[i].flavor_text;
            break;
        }
    }
    
    console.log(species.flavor_text_entries.length);
    evoFetch(species);
}

const evoFetch = async (data) =>{
    if (data.evolution_chain){
        const promise = await fetch([data.evolution_chain.url]);
        const evo = await promise.json();
        console.log(evo);

        let evoArr = [];
        
        let evolves = evo.chain.evolves_to;
        for (let i = 0; i < evolves.length; i++) {
            let evo1 = "";
            evo1 = [evo.chain.species.name, evolves[i].species.name];
            
            let evolves2 = evolves[i].evolves_to;

            if (evolves2.length >= 1) {
                for (let j = 0; j < evolves2.length; j++) {
                    let evo2 = "";
                    evo2 = [evo.chain.species.name, evolves[i].species.name, evolves2[j].species.name]
                    evoArr.push(evo2);
                }
            }
            else{
                evoArr.push(evo1);
            }
        }
        console.log(evoArr);
        // evoArr.forEach(mon => evolutionGenerator(mon));
        for(let i =0; i<evoArr.length; i++){
            for(let j =0; j<evoArr[i].length; j++){
                await evolutionGenerator(evoArr[i][j]);
            }
            
        }
        
    }
    
    
}

const evolutionGenerator = async (mon) =>{
    const promise = await fetch("https://pokeapi.co/api/v2/pokemon/"+mon);
    const data = await promise.json();

    let img = document.createElement('img');
    img.className = ("evoImg mx-auto");
    img.src = data.sprites.other.showdown.front_default;
    if(evoCount < 3){
      evoDiv.append(img);
      evoCount++;
    }
    else if(evoCount >= 3 && evoCount <6){
        evoDiv2.append(img);
        evoCount++;
    }
    else{
        evoDiv3.append(img);
        evoCount++;
    }
    
    
}

pkmnInput.addEventListener('keydown', async (event) => {
    //On enter I want this function to run
    if (event.key === "Enter") {
        pkmn = await mainApi(event.target.value);
    }
})