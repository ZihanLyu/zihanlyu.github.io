// Global variables
let weatherData = [];
let currentTimeRange = '24h';
let currentPage = 1;
const itemsPerPage = 10;
let charts = {};
let dbInitialized = false;

// Initialize the application
$(document).ready(function() {
    // Set up event listeners
    setupEventListeners();
    
    // Check if DB is initialized by trying to load data
    checkDbStatus();
});

function checkDbStatus() {
    $.ajax({
        url: '?action=get_weather_data&range=24h',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data && !data.error) {
                dbInitialized = true;
                $('#initializeDbSection').hide();
                loadWeatherData('24h');
            } else {
                dbInitialized = false;
                $('#initializeDbSection').show();
            }
        },
        error: function() {
            dbInitialized = false;
            $('#initializeDbSection').show();
        }
    });
}

function setupEventListeners() {
    // Database initialization
    $('#initDbBtn').click(function() {
        showLoading(true);
        $('#dbStatus').html('<div class="alert alert-info">Initializing database, please wait...</div>');
        
        $.ajax({
            url: '?initialize_db',
            method: 'GET',
            success: function(response) {
                if (response.includes('successfully')) {
                    $('#dbStatus').html('<div class="alert alert-success">Database initialized successfully!</div>');
                    dbInitialized = true;
                    setTimeout(function() {
                        $('#initializeDbSection').hide();
                        loadWeatherData('24h');
                    }, 2000);
                } else {
                    $('#dbStatus').html('<div class="alert alert-danger">Error: ' + response + '</div>');
                }
                showLoading(false);
            },
            error: function(xhr, status, error) {
                $('#dbStatus').html('<div class="alert alert-danger">Error: ' + error + '</div>');
                showLoading(false);
            }
        });
    });

    // File upload handling is now handled by the form submit event
    // which was added at the bottom of your code
    
    // Time range selector
    $('.time-btn').click(function() {
        $('.time-btn').removeClass('active');
        $(this).addClass('active');
        currentTimeRange = $(this).data('range');
        
        if (currentTimeRange === 'custom') {
            $('#customDateRange').show();
        } else {
            $('#customDateRange').hide();
            loadWeatherData(currentTimeRange);
        }
    });

    // Custom date range
    $('#applyCustomRange').click(function() {
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
        
        if (startDate && endDate) {
            loadWeatherData('custom', startDate, endDate);
        } else {
            alert('Please select both start and end dates');
        }
    });

    // Refresh button
    $('#refreshBtn').click(function() {
        loadWeatherData(currentTimeRange);
    });

    // Pagination
    $('#prevPage').click(function() {
        if (currentPage > 1) {
            currentPage--;
            updateDataTable();
        }
    });

    $('#nextPage').click(function() {
        const totalPages = Math.ceil(weatherData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updateDataTable();
        }
    });

    // Tab change - resize charts
    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        const target = $(e.target).attr("data-bs-target").substring(1);
        if (charts[target + 'Chart']) {
            charts[target + 'Chart'].resize();
        }
    });
}

function loadWeatherData(timeRange, startDate = null, endDate = null) {
    if (!dbInitialized) {
        return;
    }
    
    showLoading(true);
    
    let url = '?action=get_weather_data';
    let params = { range: timeRange };
    
    if (timeRange === 'custom' && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
    }
    
    $.ajax({
        url: url,
        method: 'GET',
        data: params,
        dataType: 'json',
        success: function(data) {
            if (data && !data.error) {
                weatherData = data;
                updateDashboard();
            } else {
                showError(data.error || 'Unknown error loading data');
            }
            showLoading(false);
        },
        error: function(xhr, status, error) {
            console.error('Error loading weather data:', error);
            showError('Failed to load weather data. Please try again later.');
            showLoading(false);
        }
    });
}

function refreshWeatherData() {
    // This function is called after successful SQL upload
    dbInitialized = true;
    loadWeatherData(currentTimeRange);
}

function showLoading(show) {
    if (show) {
        $('#loadingOverlay').show();
    } else {
        $('#loadingOverlay').hide();
    }
}

function showError(message) {
    alert(message);
}

function showNoDataMessage() {
    // Display a message when no data is available
    $('.stat-value, .current-temp, #currentWind, #currentWindDir, #currentHumidity, #currentPressure, #currentSolar').text('No data');
}

function updateDashboard() {
    if (weatherData.length === 0) {
        showNoDataMessage();
        return;
    }
    
    updateCurrentConditions();
    updateSummaryStatistics();
    createCharts();
    updateDataTable();
    updateLastUpdated();
}

function updateCurrentConditions() {
    // Get the most recent data point
    const latest = weatherData[weatherData.length - 1];
    
    $('#currentTemp').text(latest.avg_temp_c + '°C');
    $('#currentWind').text(latest.avg_windspeed_mps + ' m/s');
    $('#currentWindDir').text(latest.wind_direction_deg + '°');
    $('#currentHumidity').text(latest.avg_rel_humidity_percent + '%');
    $('#currentPressure').text(latest.atmos_pressure_mb + ' mb');
    $('#currentSolar').text(latest.avg_solar_rad_w + ' W/m²');
}

function updateSummaryStatistics() {
    // Calculate summary statistics
    let sumTemp = 0, maxTemp = -Infinity, minTemp = Infinity;
    let sumWind = 0, totalRain = 0, sumHumidity = 0;
    
    weatherData.forEach(data => {
        // Temperature stats
        const temp = parseFloat(data.avg_temp_c);
        sumTemp += temp;
        maxTemp = Math.max(maxTemp, temp);
        minTemp = Math.min(minTemp, temp);
        
        // Other stats
        sumWind += parseFloat(data.avg_windspeed_mps);
        totalRain += parseFloat(data.daily_rain_mm);
        sumHumidity += parseFloat(data.avg_rel_humidity_percent);
    });
    
    const avgTemp = sumTemp / weatherData.length;
    const avgWind = sumWind / weatherData.length;
    const avgHumidity = sumHumidity / weatherData.length;
    
    // Update the UI
    $('#avgTemp').text(avgTemp.toFixed(1) + '°C');
    $('#maxTemp').text(maxTemp.toFixed(1) + '°C');
    $('#minTemp').text(minTemp.toFixed(1) + '°C');
    $('#avgWind').text(avgWind.toFixed(1) + ' m/s');
    $('#totalRain').text(totalRain.toFixed(1) + ' mm');
    $('#avgHumidity').text(avgHumidity.toFixed(1) + '%');
}

function createCharts() {
    createTemperatureChart();
    createWindChart();
    createHumidityChart();
    createPressureChart();
    createSolarChart();
    createRainChart();
    createWindRoseChart();
}

function createTemperatureChart() {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    
    // Prepare data
    const labels = weatherData.map(data => data.datetime);
    const tempData = weatherData.map(data => parseFloat(data.avg_temp_c));
    
    // Destroy previous chart if exists
    if (charts.temperatureChart) {
        charts.temperatureChart.destroy();
    }
    
    // Create new chart
    charts.temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: tempData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                pointRadius: 1,
                pointHoverRadius: 5,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: getTimeUnit(),
                        tooltipFormat: 'MMM D, YYYY HH:mm'
                    },
                    title: {
                        display: true,
                        text: 'Date/Time'
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}

function createWindChart() {
    const ctx = document.getElementById('windChart').getContext('2d');
    
    // Prepare data
    const labels = weatherData.map(data => data.datetime);
    const windData = weatherData.map(data => parseFloat(data.avg_windspeed_mps));
    
    // Destroy previous chart if exists
    if (charts.windChart) {
        charts.windChart.destroy();
    }
    
    // Create new chart
    charts.windChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Wind Speed (m/s)',
                data: windData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointRadius: 1,
                pointHoverRadius: 5,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: getTimeUnit(),
                        tooltipFormat: 'MMM D, YYYY HH:mm'
                    },
                    title: {
                        display: true,
                        text: 'Date/Time'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Wind Speed (m/s)'
                    }
                }
            }
        }
    });
}

function createHumidityChart() {
    const ctx = document.getElementById('humidityChart').getContext('2d');
    
    // Prepare data
    const labels = weatherData.map(data => data.datetime);
    const humidityData = weatherData.map(data => parseFloat(data.avg_rel_humidity_percent));
    
    // Destroy previous chart if exists
    if (charts.humidityChart) {
        charts.humidityChart.destroy();
    }
    
    // Create new chart
    charts.humidityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Relative Humidity (%)',
                data: humidityData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointRadius: 1,
                pointHoverRadius: 5,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: getTimeUnit(),
                        tooltipFormat: 'MMM D, YYYY HH:mm'
                    },
                    title: {
                        display: true,
                        text: 'Date/Time'
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Relative Humidity (%)'
                    }
                }
            }
        }
    });
}

function createPressureChart() {
    const ctx = document.getElementById('pressureChart').getContext('2d');
    
    // Prepare data
    const labels = weatherData.map(data => data.datetime);
    const pressureData = weatherData.map(data => parseInt(data.atmos_pressure_mb));
    
    // Destroy previous chart if exists
    if (charts.pressureChart) {
        charts.pressureChart.destroy();
    }
    
    // Create new chart
    charts.pressureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Atmospheric Pressure (mb)',
                data: pressureData,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                pointRadius: 1,
                pointHoverRadius: 5,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: getTimeUnit(),
                        tooltipFormat: 'MMM D, YYYY HH:mm'
                    },
                    title: {
                        display: true,
                        text: 'Date/Time'
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Atmospheric Pressure (mb)'
                    }
                }
            }
        }
    });
}

function createSolarChart() {
    const ctx = document.getElementById('solarChart').getContext('2d');
    
    // Prepare data
    const labels = weatherData.map(data => data.datetime);
    const solarData = weatherData.map(data => parseFloat(data.avg_solar_rad_w));
    
    // Destroy previous chart if exists
    if (charts.solarChart) {
        charts.solarChart.destroy();
    }
    
    // Create new chart
    charts.solarChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Solar Radiation (W/m²)',
                data: solarData,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 2,
                pointRadius: 1,
                pointHoverRadius: 5,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: getTimeUnit(),
                        tooltipFormat: 'MMM D, YYYY HH:mm'
                    },
                    title: {
                        display: true,
                        text: 'Date/Time'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Solar Radiation (W/m²)'
                    }
                }
            }
        }
    });
}

function createRainChart() {
    const ctx = document.getElementById('rainChart').getContext('2d');
    
    // Prepare data
    const labels = weatherData.map(data => data.datetime);
    const rainData = weatherData.map(data => parseFloat(data.daily_rain_mm));
    
    // Destroy previous chart if exists
    if (charts.rainChart) {
        charts.rainChart.destroy();
    }
    
    // Create new chart
    charts.rainChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Rainfall (mm)',
                data: rainData,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: getTimeUnit(),
                        tooltipFormat: 'MMM D, YYYY HH:mm'
                    },
                    title: {
                        display: true,
                        text: 'Date/Time'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Rainfall (mm)'
                    }
                }
            }
        }
    });
}

function createWindRoseChart() {
    const ctx = document.getElementById('windRoseChart').getContext('2d');
    
    // Count wind directions in bins (every 45 degrees)
    const directions = [0, 0, 0, 0, 0, 0, 0, 0]; // N, NE, E, SE, S, SW, W, NW
    const dirLabels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    
    weatherData.forEach(data => {
        const deg = parseFloat(data.wind_direction_deg);
        const binIndex = Math.floor(((deg + 22.5) % 360) / 45);
        directions[binIndex]++;
    });
    
    // Destroy previous chart if exists
    if (charts.windRoseChart) {
        charts.windRoseChart.destroy();
    }
    
    // Create new chart
    charts.windRoseChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: dirLabels,
            datasets: [{
                data: directions,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(199, 199, 199, 0.5)',
                    'rgba(83, 102, 255, 0.5)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateDataTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = weatherData.slice(startIndex, endIndex);
    
    const tbody = $('#weatherTable tbody');
    tbody.empty();
    
    pageData.forEach(data => {
        const dateTime = new Date(data.datetime).toLocaleString();
        const row = `
            <tr>
                <td>${dateTime}</td>
                <td>${parseFloat(data.avg_temp_c).toFixed(1)}°C</td>
                <td>${parseFloat(data.avg_windspeed_mps).toFixed(1)} m/s</td>
                <td>${parseFloat(data.avg_rel_humidity_percent).toFixed(1)}%</td>
                <td>${parseFloat(data.daily_rain_mm).toFixed(1)} mm</td>
            </tr>
        `;
        tbody.append(row);
    });
    
    const totalPages = Math.ceil(weatherData.length / itemsPerPage);
    $('#pageInfo').text(`Page ${currentPage} of ${totalPages}`);
    
    $('#prevPage').prop('disabled', currentPage <= 1);
    $('#nextPage').prop('disabled', currentPage >= totalPages);
}

function updateLastUpdated() {
    const now = new Date().toLocaleString();
    $('#lastUpdated').text(`Last updated: ${now}`);
}

function getTimeUnit() {
    // Determine appropriate time unit based on the selected time range
    switch(currentTimeRange) {
        case '24h':
            return 'hour';
        case '3d':
        case '7d':
            return 'day';
        case '30d':
            return 'week';
        case 'custom':
            // Calculate time difference in days
            const first = new Date(weatherData[0].datetime);
            const last = new Date(weatherData[weatherData.length - 1].datetime);
            const diffDays = (last - first) / (1000 * 60 * 60 * 24);
            
            if (diffDays < 1) return 'hour';
            if (diffDays < 7) return 'day';
            if (diffDays < 30) return 'week';
            return 'month';
        default:
            return 'hour';
    }
}