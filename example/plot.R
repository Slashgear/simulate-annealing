debug <- read.csv2("./example/debug.csv", header = TRUE, sep = ";")

jpeg("rplot.jpg", width = 1000, height = "1000")

plot(debug$Index, debug$BestFitness , type="n")

lines(debug$Index, debug$BestFitness, col="red")

lines(debug$Index, debug$CurrentFitness, col="yellow")

dev.off()
