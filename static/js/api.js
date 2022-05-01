function q1() {
  var table = document.getElementById("q1Table");
  table.style.display = "none";
  table.innerHTML = "";

  var screen_name = document.getElementById("q1_screen_name").value;
  var url = "/q1?screen_name=" + screen_name;

  fetch(url).then(function(response) {
    return response.json();
  }).then(function(data) {
    table.style.display = "table";

    data.forEach(function (item, index) {
      var row = table.insertRow(-1);
      var c1 = row.insertCell(0);
      var c2 = row.insertCell(1);
      var c3 = row.insertCell(2);
      var c4 = row.insertCell(3);
      var d = new Date(item[4] * 1000);

      row.style.backgroundColor = "#dddddd";
      c1.innerHTML = item[1];
      c2.innerHTML = item[2];
      c3.innerHTML = item[3];
      c4.innerHTML = d.toLocaleTimeString('en-US') + ' ' + d.toLocaleDateString();

      item[5].forEach(function (reply, idx) {
        var r = table.insertRow(-1);
        var r1 = r.insertCell(0);
        var r2 = r.insertCell(1);
        var r3 = r.insertCell(2);
        var r4 = r.insertCell(3);
        var rd = new Date(reply[4] * 1000);

        r.style.backgroundColor = "#FFFFFF";
        r.style.borderStyle = "hidden";
        r1.style.borderStyle = "hidden";
        r1.style.paddingLeft = "30px";
        r2.style.borderStyle = "hidden";
        r3.style.borderStyle = "hidden";
        r4.style.borderStyle = "hidden";

        r1.innerHTML = reply[1];
        r2.innerHTML = reply[2];
        r3.innerHTML = reply[3];
        r4.innerHTML = rd.toLocaleTimeString('en-US') + ' ' + rd.toLocaleDateString();
      });

      row = table.insertRow(-1);
      row.style.backgroundColor = "#FFFFFF";
      row.style.borderStyle = "hidden";
      c1 = row.insertCell(0);
      c2 = row.insertCell(1);
      c3 = row.insertCell(2);
      c4 = row.insertCell(2);
      c1.style.borderStyle = "hidden";
      c2.style.borderStyle = "hidden";
      c3.style.borderStyle = "hidden";
      c4.style.borderStyle = "hidden";
    });

  }).catch(function() {
    console.log("API failed");
  });
}

function q2() {
  var table = document.getElementById("q2Table");
  table.style.display = "none";
  table.innerHTML = "<tr><th>Rank</th><th>Country</th><th>Count</th></tr>";

  var chart = new CanvasJS.Chart("q2Chart", {
    animationEnabled: true,
    theme: "light2", // "light1", "light2", "dark1", "dark2"
    title:{
      text:"Top 8 Active Countries"
    },
    axisY:{
      title: "Number of Tweets",
    },
    data: [],
  });

  var url = "/q2";

  var params = [];
  if (document.getElementById("q2_start_date").value.length > 0) {
    var t = new Date(document.getElementById("q2_start_date").value).getTime() / 1000;
    params.push(['start_ts', t]);
  }
  if (document.getElementById("q2_end_date").value.length > 0) {
    var t = new Date(document.getElementById("q2_end_date").value).getTime() / 1000;
    params.push(['end_ts', t]);
  }
  params.forEach(function (param, index) {
    if (index == 0) {
      url += '?'
    } else {
      url += '&&'
    }
    url += param[0] + '=' + param[1];
  });
  
  fetch(url).then(function(response) {
    return response.json();
  }).then(function(data) {
    document.getElementById("q2Chart").style.display = "block";
    table.style.display = "table";

    dps = [];
    data.forEach(function (item, index) {
      var row = table.insertRow(-1);
      var c1 = row.insertCell(0);
      var c2 = row.insertCell(1);
      var c3 = row.insertCell(2);
      c1.innerHTML = index + 1;
      c2.innerHTML = item[0];
      c3.innerHTML = item[1];

      dps.push({y: item[1], label: item[0]});
    });

    chart.options.data.push({
      type:"column",
      dataPoints: dps,
    });

    chart.render();

  }).catch(function() {
    console.log("API failed");
  });
}

function q3() {
  var table = document.getElementById("q3Table");
  table.style.display = "none";
  table.innerHTML = "<tr><th>Rank</th><th>UID</th><th>Screen Name</th><th>Count</th></tr>";

  var chart = new CanvasJS.Chart("q3Chart", {
    animationEnabled: true,
    
    title:{
      text:"Top 10 Active Users"
    },
    axisX:{
      interval: 1
    },
    axisY:{
      interlacedColor: "rgba(1,77,101,.2)",
      gridColor: "rgba(1,77,101,.1)",
      title: "Number of Tweets",
    },
    data: [],
  });

  var url = "/q3";

  var params = [];
  if (document.getElementById("q3_start_date").value.length > 0) {
    var t = new Date(document.getElementById("q3_start_date").value).getTime() / 1000;
    params.push(['start_ts', t]);
  }
  if (document.getElementById("q3_end_date").value.length > 0) {
    var t = new Date(document.getElementById("q3_end_date").value).getTime() / 1000;
    params.push(['end_ts', t]);
  }
  params.forEach(function (param, index) {
    if (index == 0) {
      url += '?'
    } else {
      url += '&&'
    }
    url += param[0] + '=' + param[1];
  });
  
  fetch(url).then(function(response) {
    return response.json();
  }).then(function(data) {
    document.getElementById("q3Chart").style.display = "block";
    table.style.display = "table";

    dps = [];
    data.forEach(function (item, index) {
      var row = table.insertRow(-1);
      var c1 = row.insertCell(0);
      var c2 = row.insertCell(1);
      var c3 = row.insertCell(2);
      var c4 = row.insertCell(3);
      c1.innerHTML = index + 1;
      c2.innerHTML = item[0];
      c3.innerHTML = item[1];
      c4.innerHTML = item[2];

      dps.unshift({y: item[2], label: item[1]});
    });

    chart.options.data.push({
      type:"bar",
      color: "#014D65",
      dataPoints: dps,
    });

    chart.render();

  }).catch(function() {
    console.log("API failed");
  });
}

function q4() {
  var table = document.getElementById("q4Table");
  table.style.display = "none";
  table.innerHTML = "<tr><th>Rank</th><th>Hashtag</th><th>Count</th></tr>";

  var chart = new CanvasJS.Chart("q4Chart", {
    animationEnabled: true,
    zoomEnabled: true,
    title: {
      text: "Hashtag Trends"
    },
    axisX: {
      valueFormatString: "DD MMM YYYY"
    },
    axisY2: {
      title: "Count",
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      verticalAlign: "top",
      horizontalAlign: "center",
      dockInsidePlotArea: true,
      itemclick: toogleDataSeries
    },
    data: [],
  });

  function toogleDataSeries(e) {
    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    chart.render();
  }

  var url = "/q4";

  var params = [];
  if (document.getElementById("q4_start_date").value.length > 0) {
    var t = new Date(document.getElementById("q4_start_date").value).getTime() / 1000;
    params.push(['start_ts', t]);
  }
  if (document.getElementById("q4_end_date").value.length > 0) {
    var t = new Date(document.getElementById("q4_end_date").value).getTime() / 1000;
    params.push(['end_ts', t]);
  }
  if (document.getElementById("q4_aggregation").value.length > 0) {
    params.push(['aggregation', document.getElementById("q4_aggregation").value]);
  }
  params.forEach(function (param, index) {
    if (index == 0) {
      url += '?'
    } else {
      url += '&&'
    }
    url += param[0] + '=' + param[1];
  });
  
  fetch(url).then(function(response) {
    return response.json();
  }).then(function(data) {
    document.getElementById("q4Chart").style.display = "block";
    table.style.display = "table";

    data.forEach(function (item, index) {
      var row = table.insertRow(-1);
      var c1 = row.insertCell(0);
      var c2 = row.insertCell(1);
      var c3 = row.insertCell(2);
      c1.innerHTML = index + 1;
      c2.innerHTML = item[0];
      c3.innerHTML = item[1];

      if (index < 10) {
        dps = [];
        item[2].forEach(function (ts, idx) {
          dps.push({x: new Date(ts[0] * 1000), y: ts[1]})
        });

        chart.options.data.push({
          type:"line",
          axisYType: "secondary",
          name: item[0],
          showInLegend: true,
          markerSize: 1,
          yValueFormatString: "#,###",
          dataPoints: dps,
        });
      }
    });

    chart.render();

  }).catch(function() {
    console.log("API failed");
  });
}

function q5() {
  var table = document.getElementById("q5Table");
  table.style.display = "none";
  table.innerHTML = "<tr><th>Screen Name A</th><th>UID A</th><th>Screen Name B</th><th>UID B</th><th>Screen Name C</th><th>UID C</th></tr>";

  var url = "/q5"

  fetch(url).then(function(response) {
    return response.json();
  }).then(function(data) {
    table.style.display = "table";

    data.forEach(function (item, index) {
      var row = table.insertRow(-1);
      var c1 = row.insertCell(0);
      var c2 = row.insertCell(1);
      var c3 = row.insertCell(2);
      var c4 = row.insertCell(3);
      var c5 = row.insertCell(4);
      var c6 = row.insertCell(5);

      c1.innerHTML = item[0][1];
      c2.innerHTML = item[0][0];
      c3.innerHTML = item[1][1];
      c4.innerHTML = item[1][0];
      c5.innerHTML = item[2][1];
      c6.innerHTML = item[2][0];
    });

  }).catch(function() {
    console.log("API failed");
  });
}

function q6() {
  var table = document.getElementById("q6Table");
  table.style.display = "none";
  table.innerHTML = "<tr><th>Screen Name</th><th>UID</th><th>Simple Tweet</th><th>Reply</th><th>Retweet</th><th>Quoted Retweet</th></tr>";

  var url = "/q6"

  fetch(url).then(function(response) {
    return response.json();
  }).then(function(data) {
    table.style.display = "table";

    data.forEach(function (item, index) {
      var row = table.insertRow(-1);
      var c1 = row.insertCell(0);
      var c2 = row.insertCell(1);
      var c3 = row.insertCell(2);
      var c4 = row.insertCell(3);
      var c5 = row.insertCell(4);
      var c6 = row.insertCell(5);

      c1.innerHTML = item[1];
      c2.innerHTML = item[0];
      c3.innerHTML = item[2][0] + "%";
      c4.innerHTML = item[2][1] + "%";
      c5.innerHTML = item[2][2] + "%";
      c6.innerHTML = item[2][3] + "%";
    });

  }).catch(function() {
    console.log("API failed");
  });
}