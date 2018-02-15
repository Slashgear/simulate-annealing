const math = require('mathjs');

module.exports = function(iterationLimit, temperature, decrease, fitness = () => 1, firstValue, neighbor = el => el, debug = false) {
    let bestFound = {
        fitness: fitness(firstValue),
        value: firstValue,
    };

    let currentValue = {
        ...bestFound
    };
    
    let debugData = [] ;

    for(let i=0; i<iterationLimit; i++) {
        const newValue = neighbor(currentValue.value)
        const currentValueNeighbor = {
            value: newValue,
            fitness: fitness(newValue)
        }

        if(currentValueNeighbor.fitness < bestFound.fitness) {
            currentValue = currentValueNeighbor;
            bestFound = currentValueNeighbor;
        } else {
            const randomValue = Math.random();
            const estimate = math.exp(math.divide(currentValueNeighbor.fitness - bestFound.fitness, temperature));
            if(randomValue < estimate){
                currentValue = currentValueNeighbor; 
            }
        }
        if(debug) {
            debugData.push({i,temperature: Math.round(temperature,-1), bestFitness: Math.round(bestFound.fitness, -1), currentFitness: Math.round(currentValue.fitness, -1)})        
        }
        temperature = temperature * decrease;
    }

    return {bestFound, debug: debugData};
}