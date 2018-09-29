import * as d3 from 'd3'

// Set up margin/height/width
var margin = { top: 15, right: 15, bottom: 40, left: 30 }

var height = 135 - margin.top - margin.bottom
var width = 100 - margin.left - margin.right
// I'll give you the container
var container = d3.select('#chart-2')

// Create your scales
var xPositionScale = d3
  .scaleLinear()
  .domain([13, 55])
  .range([0, width])

var yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

var areaUS = d3
  .area()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y1(function(d) {
    return yPositionScale(d.ASFR_us)
  })
  .y0(height)

var areaJapan = d3
  .area()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y1(function(d) {
    return yPositionScale(d.ASFR_jp)
  })
  .y0(height)

// Read in your data
d3.csv(require('./fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Build your ready function that draws lines, axes, etc
function ready(datapoints) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.Year
    })
    .entries(datapoints)

  container
    .selectAll('.year-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'year-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      // which svg are we looking at?

      var svg = d3.select(this)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', areaUS)
        .attr('stroke', 'none')
        .attr('fill', 'blue')
        .attr('fill-opacity', 0.25)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', areaJapan)
        .attr('stroke', 'none')
        .attr('fill', 'red')
        .attr('fill-opacity', 0.25)
      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('font-size', 15)
        .attr('dy', -2)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')

      var datapoints = d.values
      var usSum = d3.sum(datapoints, d => +d.ASFR_us).toFixed(2)
      var japanSum = d3.sum(datapoints, d => +d.ASFR_jp).toFixed(2)

      svg
        .append('text')
        .text(usSum)
        .attr('x', xPositionScale(45))
        .attr('y', yPositionScale(0.2))
        .attr('font-size', 13)
        .attr('text-anchor', 'middle')
        .attr('fill', 'blue')
        .attr('font-weight', 'bold')

      svg
        .append('text')
        .text(japanSum)
        .attr('x', xPositionScale(45))
        .attr('y', yPositionScale(0.15))
        .attr('font-size', 13)
        .attr('text-anchor', 'middle')
        .attr('fill', 'red')
        .attr('font-weight', 'bold')

      var xAxis = d3.axisBottom(xPositionScale).tickValues([15, 30, 45])
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      var yAxis = d3.axisLeft(yPositionScale).tickValues([0, 0.1, 0.2, 0.3])
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    })
}
