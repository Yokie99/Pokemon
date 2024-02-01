const saveToLocalStorage = (mon) => {
    //favorites will get the current values in local storage
    //AKA saves the array in favorites
    let favorites = getlocalStorage();


    if(!isObjectInFavorites(mon, favorites)) {
        favorites.push(mon);
    }
    //JSON.stringify insures what ever we save into local storage is a string
    localStorage.setItem("Favorites", JSON.stringify(favorites));
}

const isObjectInFavorites = (obj, favorites) => {
    // Check if an object with the same name already exists in favorites
    return favorites.some(favorite => favorite.name === obj.name);
   
  }



const getlocalStorage = () => {
    //Getting our values from local storage
    let localStorageData = localStorage.getItem("Favorites");

    //We check if that data is null if so we retun an empty array
    if(localStorageData == null){
        return [];
    }
    // We return an array of local storage.
    return JSON.parse(localStorageData);

}

const removeFromLocalStorage = (mon) => {
    //We're saving local storage data into favorites variable
    let favorites = getlocalStorage();

    favorites = favorites.filter(favorite => favorite.name !== mon.name);

    //We set our new mutated favotires array inside our local storage.
    localStorage.setItem("Favorites", JSON.stringify(favorites))

}

export {saveToLocalStorage, getlocalStorage, removeFromLocalStorage, isObjectInFavorites};