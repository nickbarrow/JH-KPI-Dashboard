var grid, charts = [];

function loadGridStackLayout() {
  if (typeof GridStack !== 'undefined') {
    grid = GridStack.init({
      column: 8,
      cellHeight: 170,
      alwaysShowResizeHandle: true,
    });

    // Get grid layout from JSON
    $.getJSON('../data/gridLayout.json', function (data) {
      // grid.load(data);
      loadChartJS();
    })
    .fail(function () {
      alert('No GridStack profile found! Using blank grid.');
    })
  }
}

function loadChartJS() {
  let chartCanvases = document.querySelectorAll('.chart-container > canvas');

  if (chartCanvases.length) {
    chartCanvases.forEach(canvas => {
      // Attempt load data based on canvas ID
      // Don't spend too much time on this, likely vastly different in reality.
      $.getJSON(`../data/${canvas.dataset.chartType}.json`, data => {
        charts.push(new Chart(canvas.getContext('2d'), data));
      })
      .fail(() => {
        alert(`No data found for ${canvas.dataset.chartType}`);
        // Replace canvas with error text
      })
    });
  }
}

function promptAddItem() {
  if (typeof Modal !== 'undefined') {
    Modal.show(`
      <div class="add-widget">
        <select onchange="addItem()">
          <option selected disabled>Chart type...</option>
          <option>Doughnut</option>
          <option>Line</option>
          <option>Bar</option>
          <option>Half Tile</option>
        </select>
      </div>
    `);
  }
}

function addItem() {
  let s = document.querySelector('.modal-body .add-widget > select');
  s = s.value.replace(/ /g,'')
  fetch(`../charts/${s}.html`)
    .then(response => response.text())
    .then(data => {
      Modal.hide();

      let $dataEl = $.parseHTML(data),
          $actualElement = $dataEl[$dataEl.length-1];
      grid.addWidget($actualElement);
      destroyCharts();
      loadChartJS();
    });
}

function expandTile(btn) {
  let tile = btn.closest('.grid-stack-item');
  let oldHeight = tile.getAttribute('gs-h');
  
  if (tile.dataset.expanded == 'true') {
    // Maxmimzed
    grid.update(tile, { h: oldHeight/2 });
    tile.setAttribute('data-expanded', 'false');
    btn.classList.remove('active');
  } else {
    // Minimized
    grid.update(tile, { h: oldHeight*2 });
    tile.setAttribute('data-expanded', 'true');
    btn.classList.add('active');
  }
}

function saveGrid() {
  if (grid) {
    let serializedGrid = grid.save();
    Modal.show("<p>Paste into data/gridLayout.json:</p>");
    let ta = $('<textarea>');
    ta.val(JSON.stringify(serializedGrid, null, 2));
    $('.modal-body').append(ta);
    if (!$('.modal-buttons > button.copy').length);
      $('.modal-buttons').prepend('<button type="button" class="btn copy" onclick="Modal.copy()">Copy</button>');
  }
}

function destroyCharts() {
  charts.forEach(chart => { chart.destroy() })
}

function removeTile(buttonElement) {
  let tile = $(buttonElement).closest('.grid-stack-item');
  if (tile.length) grid.removeWidget(tile[0]);
}



$('.grid-stack').click(function (e) {
  if (e.target === this && $(e.target).is(':empty')) promptAddItem()
});

loadGridStackLayout()