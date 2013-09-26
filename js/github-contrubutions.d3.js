
var chart;
nv.addGraph(function() {
  chart = nv.models.historicalBarChart();
  chart
    .margin({left: 100, bottom: 100})
    .x(function(d,i) { return i; })
    .transitionDuration(250)
    ;

  // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
  chart.xAxis
    .axisLabel("Time (s)")
    .tickFormat(d3.format(',.1f'));

  chart.yAxis
    .axisLabel('Voltage (v)')
    .tickFormat(d3.format(',.2f'));

  chart.showXAxis(true);

  d3.select('#test1')
    .datum(sinData())
    .transition().duration(0)
    .call(chart);

  //TODO: Figure out a good way to do this automatically
  nv.utils.windowResize(chart.update);
  //nv.utils.windowResize(function() { d3.select('#chart1 svg').call(chart) });

  chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

  return chart;
});


function sinData() {
  var sin = [],
      i;

  for (i = 0; i < 100; i++) {
    sin.push({x: i, y: Math.sin(i/10)});
  }

  return [
    {
      values: sin,
      key: "Sine Wave",
      color: "#ff7f0e"
    }
  ];
}


