const _ = require('lodash');
const chalk = require('chalk');
const distance = require('gps-distance');
const simulateAnnealing = require('../index');
const points = require('./capitals.json');
const fs = require('fs');

const showTravel = listOfPoints => listOfPoints.map(p => p.name);

const fitness = listOfPoints => distance(listOfPoints.map(point => [point.lat, point.lon]));

const neighbor = array => {
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

const decrease = 0.9;

const randomOrder = _.shuffle(points);

console.log(chalk.red('Begin Step: ', showTravel(randomOrder), fitness(randomOrder)));

const {bestFound, debug} = simulateAnnealing(10000, 5000, 0.99, fitness, randomOrder, neighbor, true);

console.log(chalk.yellow('Best travel found', showTravel(bestFound.value), '', bestFound.fitness));

var stream = fs.createWriteStream("./example/debug.csv");

stream.once('open', function(fd) {
    stream.write("Index;Temperature;BestFitness;CurrentFitness\n");
    debug.forEach(it => {
        stream.write(`${it.i};${it.temperature};${it.bestFitness};${it.currentFitness}\n`);
    });
    stream.end();
});