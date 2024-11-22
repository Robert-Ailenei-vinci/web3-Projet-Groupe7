export async function planetDataRetrieval(namePlanet) {

    const response = await fetch('https://api.le-systeme-solaire.net/rest/bodies/' + namePlanet);
    if (!response.ok) throw new Error(`fetch error : ${response.status} : ${response.statusText}`);

    const planetsWithDetails = await response.json();
    console.log('Planet with details: ', planetsWithDetails);
    
    return planetsWithDetails;
}

export default planetDataRetrieval