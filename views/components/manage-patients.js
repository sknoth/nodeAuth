google.charts.load("current", {packages:["corechart"]});

google.charts.setOnLoadCallback(drawChart);

function decorateCsvData(data) {

  for(var i = 0; i < data.length; i++) {
    if(i === 0) {
      data[i].unshift('ID');
    } else {
      data[i][0] = Number(data[i][0]);
      data[i][1] = Number(data[i][1]);
      data[i][2] = Number(data[i][2]);
      data[i].unshift('');
    }
  }
  return data;
}

function drawChart() {

  var data = decorateCsvData(<%- JSON.stringify(csvData) %>);

  data = google.visualization.arrayToDataTable(data);

  var options = {
    title: 'Spiral drawing Exercise 1',
    colorAxis: {colors: ['#9ae2ff', 'teal']},
    hAxis: {title: 'y'},
    vAxis: {title: 'x'},
    animation: {
      startup: true
    },
    bubble: {
      stroke: 'transparent'
    },
    sizeAxis: {
      minSize: 1,
      maxSize: 4
    }
  };

  var chart = new google.visualization.BubbleChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}
