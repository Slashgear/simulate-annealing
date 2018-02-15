const _ = require('lodash');
const math = require('mathjs');
const chalk = require('chalk');
const distance = require('gps-distance');

const points = require('./capitals.json');

const showTravel = listOfPoints => listOfPoints.map(p => p.name);

const evaluateTravel = listOfPoints => distance(listOfPoints.map(point => [point.lat, point.lon]));

const randomSwap = array => {
    const items = [...array];
    const firstRandomIndex = Math.floor(Math.random()*items.length);
    let secondRandomIndex = firstRandomIndex;
    while(secondRandomIndex === firstRandomIndex) {
        secondRandomIndex = Math.floor(Math.random()*items.length);
    } 
    const temp = items[secondRandomIndex];
    items[secondRandomIndex]= items[firstRandomIndex];
    items[firstRandomIndex] = temp;
    return items;
}

const randomOrder = _.shuffle(points);

console.log(chalk.red('Begin Step: ', showTravel(randomOrder), evaluateTravel(randomOrder)));

let bestFoundOrder = {
    order: [...randomOrder],
    cost: evaluateTravel(randomOrder)
};

let currentOrder = {
   order: [...randomOrder],
    cost: bestFoundOrder.cost
};
const evolution = [];

for(let temperature = 100000; temperature > 0; temperature--) {
    const neighbor = randomSwap(currentOrder.order);
    const neighborCost = evaluateTravel(neighbor);

    if(neighborCost < bestFoundOrder.cost) {
        bestFoundOrder = {
            order: [...neighbor],
            cost: neighborCost
        };
        currentOrder = {
            order: [...neighbor],
            cost: neighborCost
        }
    } else {
        const aleatoire = Math.random();
        const estimate = math.exp(math.divide(currentOrder.cost - bestFoundOrder.cost, temperature));
        if(aleatoire < estimate){
            currentOrder = {
                order: [...neighbor],
                cost: neighborCost
            }
        }
    }
    evolution.push({x: temperature, y: neighborCost});
}

console.log(chalk.yellow('Best travel found', showTravel(bestFoundOrder.order), '', bestFoundOrder.cost));
