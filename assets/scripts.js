// Looks dirty but this is just for dev
var gridLayout = $.ajax({
  type: 'GET',
  url: '../data/gridLayout.json',
  dataType: 'json',
  async: false
});


const cellGap = 10;
const cellPadding = 34;
const innerCellHeight = 150;
const actualCellHeight = 150 + (cellPadding * 2) + (cellGap * 2);

/**
   * Gridstack Initialization
   */
var grid = GridStack.init({
  column: 8,
  cellHeight: 170,
});

grid.load(gridLayout);

function addItem(text = "Item") {
  grid.addWidget({
    w: 2,
    h: 1,
    content: text
  });
}

function expandTile(btn) {
  let tile = btn.closest('.grid-stack-item');
  let oldHeight = tile.getAttribute('gs-h');
  
  if (tile.dataset.expanded == 'true') {
    // Already expanded
    grid.update(tile, { h: oldHeight/2 });
    tile.setAttribute('data-expanded', 'false');
    btn.classList.remove('active');
  } else {
    grid.update(tile, { h: oldHeight*2 });
    tile.setAttribute('data-expanded', 'true');
    btn.classList.add('active');
  }
}

function saveGrid() {
  if (grid) {
    let serializedGrid = grid.save();
    Modal.show(serializedGrid)
  }
}

function loadGrid() {
  let config = prompt("Paste GridStack serialized config here:");
  if ((config && grid) && typeof config == 'string') {
    grid.removeAll(false);
    grid.load(JSON.parse(config), true);
  }
}


/**
 * Chart.js Initialization
 */
const workEntriesContext = document.getElementById('workEntries').getContext('2d');
const workEntriesChart = new Chart(workEntriesContext, {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [75, 25],
      backgroundColor: [
        '#0BB22E',
        '#E7E7EA'
      ],
      borderWidth: 0
    }]
  },
  options: {
    maintainAspectRatio: false,
    cutout: '75%'
  }
})

const spqContext = document.getElementById('chart1').getContext('2d');
const spqChart = new Chart(spqContext, {
  type: 'line',
  data: {
    labels: ['Q1 - 2021', 'Q2 - 2021', 'Q3 - 2021', 'Q4 - 2021'],
    datasets: [{
      data: [200000, 400000, 300000, 400000],
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.1)',
      borderColor: [
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 2,
      pointBackgroundColor: 'rgba(54, 162, 235, 1)'
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  }
});

const utilizationRateContext = document.getElementById('utilizationRateCanvas').getContext('2d');
const utilizationRateChart = new Chart(utilizationRateContext, {
  type: 'bar',
  data: {
    labels: ['March', 'April', 'May'],
    datasets: [{
      label: 'JH Total',
      backgroundColor: '#1774E5',
      data: [100, 90, 100],
      borderWidth: 0,
      maxBarThickness: 25
    },
    {
      label: 'AM Team',
      backgroundColor: '#900BF1',
      data: [70, 80, 60],
      borderWidth: 0,
      maxBarThickness: 25
    },
    {
      label: 'PM Team',
      backgroundColor: '#66C8FF',
      data: [100, 80, 100],
      borderWidth: 0,
      maxBarThickness: 25
    },
    {
      label: 'Web Team',
      backgroundColor: '#FE9313',
      data: [60, 60, 80],
      borderWidth: 0,
      maxBarThickness: 25
    }]
  },
  options: {
    maintainAspectRatio: false
  }
});