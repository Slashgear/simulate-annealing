const _ = require('lodash');
const math = require('mathjs');
const chalk = require('chalk');
const distance = require('gps-distance');
const fs = require('fs');

const points = [
    {
        name: 'Paris',
        lat: 48.8790173,
        lon: 2.328515
    },
    {
        name: 'Lyon',
        lat: 45.7621772,
        lon: 4.8622545
    },
    {
        name: 'Lille',
        lat: 50.6364454,
        lon: 3.0619816
    },
    {
        name: 'Rennes',
        lat: 48.1149512,
        lon: -1.6735092
    },
    {
        name: 'Nantes',
        lat: 47.2137733,
        lon: -1.5566822
    },
    {
        name: 'Bordeaux',
        lat: 44.8766633,
        lon: -0.5799972999999999
    },
    {
        name: 'Montréal',
        lat: 45.5017089,
        lon: -73.5728828
    },
    {
        name: 'Singapour',
        lat: 1.2880208,
        lon: 103.8469787
    },
    {
        name: 'Grenoble',
        lat: 45.188529,
        lon: 5.724524
    },
];

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

let currentOrder = [...randomOrder]; 
const evolution = []

for(let temperature = 10000; temperature > 0; temperature--) {
    const neighbor = randomSwap(currentOrder);
    const neighborCost = evaluateTravel(neighbor);

    if(neighborCost < bestFoundOrder.cost) {
        bestFoundOrder = {
            order: [...neighbor],
            cost: neighborCost
        }
        currentOrder = [...neighbor];
    } else {
        const aleatoire = Math.random();
        const estimate = math.exp(-math.divide(math.abs(neighborCost - bestFoundOrder.cost), temperature));
        if(aleatoire < estimate){
            currentOrder = [...neighbor];
        }
    }
    evolution.push({x: temperature, y: neighborCost});
}

console.log(chalk.yellow('Best travel found', showTravel(bestFoundOrder.order), '', bestFoundOrder.cost));

fs.writeFile("result.csv", evolution.map(item => `${item.y}`).join('\n'), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 