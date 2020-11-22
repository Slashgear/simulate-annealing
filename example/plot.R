debug <- read.csv2("../debug.csv", header = TRUE, sep = ";")
plot(debug$Index, debug$BestFitness , type="n")

lines(debug$Index, debug$BestFitness, col="red")

lines(debug$Index, debug$CurrentFitness, col="yellow")
