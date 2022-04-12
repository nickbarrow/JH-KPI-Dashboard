let randomInt = (a, b) => {
  // No params: 0-100
  if (a === undefined && b === undefined) return Math.floor(Math.random() * 101);
  // No second param: treat a as max.
  if (b === undefined) return Math.floor(Math.random() * (a + 1));
  // Otherwise use both.
  else return Math.floor(Math.random() * (b - a + 1)) + a;
}



var Dashboard = {};

Dashboard.grid = null;

Dashboard.charts = [];

Dashboard.initGridStack = function () {
  if (typeof GridStack !== 'undefined') {
    Dashboard.grid = GridStack.init({
      column: 8,
      cellHeight: 170,
      alwaysShowResizeHandle: true,
    });
  }
};

Dashboard.destroyAllCharts = function () {
  Dashboard.charts.forEach(chart => { chart.destroy(); });
  Dashboard.charts = [];
}

Dashboard.refreshChartJS = function () {
  if (Dashboard.charts.length) Dashboard.destroyAllCharts();

  let chartCanvases = document.querySelectorAll('.chart-container > canvas');

  if (chartCanvases.length) {
    chartCanvases.forEach(canvas => {
      // Attempt load data based on canvas ID
      // Don't spend too much time on this, likely vastly different in reality.
      $.getJSON(`../data/${canvas.dataset.chartType}.json`, function (chartData) {
        let tData = JSON.parse(JSON.stringify(chartData));

        // Loop chart's datasets (1 or more).
        tData.data.datasets.forEach((ds, dsIdx) => {
          // Loop over dataset's data.
          ds.data.forEach((_, dIdx) => {
            let r;
            switch (tData.type) {
              case 'doughnut':
                if (dIdx === 0) r = randomInt(100);
                else r = 100 - tData.data.datasets[dsIdx].data[dIdx-1];
                break;
              case 'line':
                r = randomInt(100000, 300000);
                break;
              case 'bar':
                r = randomInt(100);
                break;
              default: break;
            }
            
            tData.data.datasets[dsIdx].data[dIdx] = r
          })
        });

        Dashboard.charts.push(new Chart(canvas.getContext('2d'), tData));
      })
      .fail(() => {
        alert(`No data found for ${canvas.dataset.chartType}`);
        // Replace canvas with error text
      })
    });
  }
};

Dashboard.loadProfile = function () {
  // Get grid layout from JSON
  $.getJSON('../data/profile.json', function (data) {
    Dashboard.grid.load(data);
    Dashboard.refreshChartJS();
  }).fail(function () {
    alert('No GridStack profile found!');
  });
};

Dashboard.init = function () {
  Dashboard.initGridStack();
  Dashboard.refreshChartJS();

  // Add click listener to empty dashboard.
  $('.grid-stack').click(function (e) {
    if (e.target === this && $(e.target).is(':empty'))
      Dashboard.promptAddChart();
  });
};

Dashboard.promptAddChart = function () {
  if (typeof Modal !== 'undefined') {
    Modal.show(`
      <div class="add-widget">
        <select onchange="Dashboard.addChart(this.value)">
          <option selected disabled>Chart type...</option>
          <option>Doughnut</option>
          <option>Line</option>
          <option>Bar</option>
          <option>Half Tile</option>
        </select>
      </div>
    `);
  }
};

Dashboard.addChart = function (v) {
  fetch(`../charts/${v.replace(/ /g,'')}.html`)
    .then(response => response.text())
    .then(data => {
      Modal.hide();
      let $dataEl = $.parseHTML(data),
          $actualElement = $dataEl[$dataEl.length-1];
      Dashboard.grid.addWidget($actualElement);
      Dashboard.refreshChartJS();
    });
};

Dashboard.saveProfile = function () {
  let serializedGrid = Dashboard.grid.save();
  Modal.show("<p>Paste into data/gridLayout.json:</p>");
  let ta = $('<textarea>');
  ta.val(JSON.stringify(serializedGrid, null, 2));
  $('.modal-body').append(ta);
  if (!$('.modal-buttons > button.copy').length);
    $('.modal-buttons').prepend('<button type="button" class="btn copy" onclick="Modal.copy()">Copy</button>');
};

Dashboard.removeChart = function (buttonElement) {
  let tile = $(buttonElement).closest('.grid-stack-item');
  if (tile.length) Dashboard.grid.removeWidget(tile[0]);
  Dashboard.refreshChartJS();
};

Dashboard.expandChart = function (button) {
  let tile = button.closest('.grid-stack-item');
  let oldHeight = tile.getAttribute('gs-h');
  
  if (tile.dataset.expanded == 'true') {
    // Maxmimzed
    Dashboard.grid.update(tile, { h: oldHeight/2 });
    tile.setAttribute('data-expanded', 'false');
    button.classList.remove('active');
  } else {
    // Minimized
    Dashboard.grid.update(tile, { h: oldHeight*2 });
    tile.setAttribute('data-expanded', 'true');
    button.classList.add('active');
  }
};


Dashboard.init();