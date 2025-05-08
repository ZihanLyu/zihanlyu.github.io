<?php
session_start();
$dsn = "mysql:host=127.0.0.1;dbname=Weather";
$username = "root";
$password = "Lzh20030225!";

// Set default date range
$defaultFromDate = "2023-01-01";
$defaultToDate = "2023-12-31";

function roundUp($value, $precision = 2) {
    $multiplier = pow(10, $precision);
    return ceil($value * $multiplier) / $multiplier;
}

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Handle AJAX request for graph update
    if (isset($_GET['ajax']) && $_GET['ajax'] === '1') {
        header('Content-Type: application/json');

        $from = $_GET['from'] ?? $defaultFromDate;
        $to = $_GET['to'] ?? $defaultToDate;

        if (empty($from) || empty($to)) {
            echo json_encode(['error' => 'Both dates are required.']);
            exit;
        }

        if ($from > $to) {
            echo json_encode(['error' => "'From' date cannot be later than 'To' date."]);
            exit;
        }

        $date1 = $from . " 00:00:00";
        $date2 = $to . " 23:59:59";

        // Get summary data for the selected date range
        $summaryStmt = $pdo->prepare("
            SELECT 
                AVG(AverageTemp) AS avg_temp,
                MAX(AverageTemp) AS max_temp,
                MIN(AverageTemp) AS min_temp,
                AVG(AverageWindSpeed) AS avg_wind,
                SUM(DailyRain) AS total_rainfall,
                AVG(AverageRelHumidity) AS avg_humidity,
                AVG(WindDirection) AS avg_wind_direction
            FROM whately2023
            WHERE timestamp BETWEEN ? AND ?
        ");
        $summaryStmt->execute([$date1, $date2]);
        $summary = $summaryStmt->fetch(PDO::FETCH_ASSOC);

        // Format summary data
        // Format summary data with rounding up
        $precisionMap = [
            'total_rainfall' => 2
        ];
        $formattedSummary = [];
        foreach ($summary as $key => $value) {
            $precision = $precisionMap[$key] ?? 1;
            $formattedSummary[$key] = roundUp((float)$value, $precision);
        }

        // Get detailed data for graphs
        $stmt = $pdo->prepare("
            SELECT 
                timestamp,
                AverageTemp,
                AverageWindSpeed,
                WindDirection,
                AverageRelHumidity,
                AtmosPressure,
                AverageSolarRadiation,
                DailyRain
            FROM whately2023
            WHERE timestamp BETWEEN ? AND ?
            ORDER BY timestamp ASC
        ");
        $stmt->execute([$date1, $date2]);
        $rawData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $dailyData = [];
        foreach ($rawData as $row) {
            $date = substr($row['timestamp'], 0, 10);
            if (!isset($dailyData[$date])) {
                $dailyData[$date] = [
                    'temps' => [],
                    'winds' => [],
                    'rains' => [],
                    'humidity' => [],
                ];
            }
            $dailyData[$date]['temps'][] = (float)$row['AverageTemp'];
            $dailyData[$date]['winds'][] = (float)$row['AverageWindSpeed'];
            $dailyData[$date]['rains'][] = (float)$row['DailyRain'];
            $dailyData[$date]['humidity'][] = (float)$row['AverageRelHumidity'];
        }

        $graphData = [
            'dates' => [],
            'temperature' => [],
            'wind' => [],
            'rain' => [],
            'humidity' => [],
        ];

        foreach ($dailyData as $date => $values) {
            $graphData['dates'][] = $date;
            foreach (['temperature' => 'temps', 'wind' => 'winds', 'rain' => 'rains', 'humidity' => 'humidity'] as $key => $field) {
                $dataset = $values[$field];
                $graphData[$key][] = [
                    'avg' => array_sum($dataset) / count($dataset),
                    'min' => min($dataset),
                    'max' => max($dataset),
                ];
            }
        }

        // Combine summary and graph data in the response
        $response = [
            'summary' => $formattedSummary,
            'graphData' => $graphData
        ];

        echo json_encode($response);
        exit;
    }

    // Handle AJAX request for CSV preview update
    if (isset($_GET['update_preview']) && $_GET['update_preview'] === '1') {
        $from = $_GET['from'] ?? $defaultFromDate;
        $to = $_GET['to'] ?? $defaultToDate;

        if (empty($from) || empty($to)) {
            echo json_encode(['error' => 'Both dates are required.']);
            exit;
        }

        if ($from > $to) {
            echo json_encode(['error' => "'From' date cannot be later than 'To' date."]);
            exit;
        }

        $date1 = $from . " 00:00:00";
        $date2 = $to . " 23:59:59";

        $sql = "SELECT * FROM whately2023 WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp ASC";
        $statement = $pdo->prepare($sql);
        $statement->execute([$date1, $date2]);
        $tableData = $statement->fetchAll(PDO::FETCH_ASSOC);

        $_SESSION['table_data'] = $tableData;
        $_SESSION['selected_from'] = $from;
        $_SESSION['selected_to'] = $to;

        if (empty($tableData)) {
            echo json_encode(['error' => 'No data found for the selected date range.']);
            exit;
        }

        // Build HTML table for response
        $html = '<h2 style="text-align:center;">Detailed Data Table (' . $from . ' to ' . $to . ')</h2>';
        $html .= '<div style="overflow-x:auto;"><table><thead><tr>';
        
        // Table headers
        foreach (array_keys($tableData[0]) as $colName) {
            $html .= '<th>' . htmlspecialchars($colName) . '</th>';
        }
        
        $html .= '</tr></thead><tbody>';
        
        // Table rows
        foreach ($tableData as $row) {
            $html .= '<tr>';
            foreach ($row as $columnName => $value) {
                // You can adjust which fields need 1 or 2 decimals
                if (is_numeric($value)) {
                    // Apply rounding based on precision, for example, 2 decimals for 'total_rainfall', 1 for others
                    $precision = 1; // Default precision
                    if ($columnName == 'total_rainfall') {
                        $precision = 2; // Set 2 decimals for 'total_rainfall'
                    } else {
                        $precision = 1;
                    }

                    // Round and format the value
                    $formattedValue = roundUp((float)$value, $precision);
                    $html .= '<td>' . htmlspecialchars(number_format($formattedValue, $precision)) . '</td>';
                } else {
                    $html .= '<td>' . htmlspecialchars($value) . '</td>';
                }
            }
            $html .= '</tr>';
        }
        
        $html .= '</tbody></table></div>';
        
        echo json_encode(['html' => $html, 'count' => count($tableData)]);
        exit;
    }

    // Normal Page Load - Use default date range
    $date1 = $defaultFromDate . " 00:00:00";
    $date2 = $defaultToDate . " 23:59:59";
    
    // Get summary data for the default date range
    $stmt = $pdo->prepare("
        SELECT 
            AVG(AverageTemp) AS avg_temp,
            MAX(AverageTemp) AS max_temp,
            MIN(AverageTemp) AS min_temp,
            AVG(AverageWindSpeed) AS avg_wind,
            SUM(DailyRain) AS total_rainfall,
            AVG(AverageRelHumidity) AS avg_humidity,
            AVG(WindDirection) AS avg_wind_direction
        FROM whately2023
        WHERE timestamp BETWEEN ? AND ?
    ");
    $stmt->execute([$date1, $date2]);
    $summary = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get detailed data for the default date range
    $stmt = $pdo->prepare("
        SELECT 
            timestamp,
            AverageTemp,
            AverageWindSpeed,
            WindDirection,
            AverageRelHumidity,
            AtmosPressure,
            AverageSolarRadiation,
            DailyRain
        FROM whately2023
        WHERE timestamp BETWEEN ? AND ?
        ORDER BY timestamp ASC
    ");
    $stmt->execute([$date1, $date2]);
    $rawData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $dailyData = [];
    foreach ($rawData as $row) {
        $date = substr($row['timestamp'], 0, 10);
        if (!isset($dailyData[$date])) {
            $dailyData[$date] = [
                'temps' => [],
                'winds' => [],
                'rains' => [],
                'humidity' => [],
            ];
        }
        $dailyData[$date]['temps'][] = (float)$row['AverageTemp'];
        $dailyData[$date]['winds'][] = (float)$row['AverageWindSpeed'];
        $dailyData[$date]['rains'][] = (float)$row['DailyRain'];
        $dailyData[$date]['humidity'][] = (float)$row['AverageRelHumidity'];
    }

    $graphData = [
        'dates' => [],
        'temperature' => [],
        'wind' => [],
        'rain' => [],
        'humidity' => [],
    ];

    foreach ($dailyData as $date => $values) {
        $graphData['dates'][] = $date;
        foreach (['temperature' => 'temps', 'wind' => 'winds', 'rain' => 'rains', 'humidity' => 'humidity'] as $key => $field) {
            $dataset = $values[$field];
            $graphData[$key][] = [
                'avg' => array_sum($dataset) / count($dataset),
                'min' => min($dataset),
                'max' => max($dataset),
            ];
        }
    }

    // Handle Download
    if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["from"], $_POST["to"]) && isset($_POST["download"])) {
        $from = $_POST["from"];
        $to = $_POST["to"];

        if (empty($from) || empty($to)) {
            $error = "Both dates are required.";
        } elseif ($from > $to) {
            $error = "'From' date cannot be later than 'To' date.";
        } elseif (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $from) || !preg_match("/^\d{4}-\d{2}-\d{2}$/", $to)) {
            $error = "Invalid date format. Please use YYYY-MM-DD.";
        } else {
            $date1 = $from . " 00:00:00";
            $date2 = $to . " 23:59:59";

            $sql = "SELECT * FROM whately2023 WHERE timestamp BETWEEN ? AND ?";
            $statement = $pdo->prepare($sql);
            $statement->execute([$date1, $date2]);
            $downloadData = $statement->fetchAll(PDO::FETCH_ASSOC);

            $_SESSION['selected_from'] = $from;
            $_SESSION['selected_to'] = $to;

            if (!empty($downloadData)) {
                $filename = "weather_data_" . $from . "_to_" . $to . ".csv";
                header('Content-Type: text/csv');
                header('Content-Disposition: attachment; filename="' . $filename . '"');
                header('Pragma: no-cache');
                header('Expires: 0');
                $output = fopen('php://output', 'w');
                fputcsv($output, array_keys($downloadData[0]));
                foreach ($downloadData as $row) {
                    fputcsv($output, $row);
                }
                fclose($output);
                $_SESSION['download_success'] = true;
                exit;
            } else {
                $error = "No data found for the selected date range.";
            }
        }
    } else {
        // Default: show most recent 50 rows (still showing these in descending order since it's "most recent")
        $sql = "SELECT * FROM whately2023 ORDER BY timestamp DESC LIMIT 50";
        $statement = $pdo->prepare($sql);
        $statement->execute();
        $downloadData = $statement->fetchAll(PDO::FETCH_ASSOC);

        $_SESSION['selected_from'] = "Most Recent";
        $_SESSION['selected_to'] = "";
    }

    $_SESSION['table_data'] = $downloadData;

} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Weather Statistics</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f0f8ff; }
        h1, h2 { text-align: center; }
        .summary { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-bottom: 40px; }
        .card { background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 200px; text-align: center; }
        form { text-align: center; margin-bottom: 40px; }
        label { margin: 0 10px; }
        input[type="date"] { margin: 0 10px; }
        input[type="submit"], button { padding: 8px 16px; margin: 0 5px; }
        canvas { width: 100% !important; height: 500px !important; max-width: 1200px; margin: 40px auto; display: block; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 8px; border: 1px solid #ccc; text-align: center; }
        .error { color: red; text-align: center; margin-top: 20px; }
        .date-range-info { text-align: center; margin: 10px 0; font-style: italic; color: #555; }
        .action-buttons { text-align: center; margin: 20px 0; }
        .data-count { text-align: center; margin: 10px 0; color: #555; }
        .loading { text-align: center; margin: 20px 0; display: none; }
    </style>
</head>
<body>

<h1>Weather Statistics Summary</h1>

<?php if (isset($error)): ?>
    <div class="error"><?= htmlspecialchars($error) ?></div>
<?php endif; ?>

<form id="dateRangeForm" method="POST">
    <label>From: <input type="date" name="from" id="fromDate" value="<?= $defaultFromDate ?>" required></label>
    <label>To: <input type="date" name="to" id="toDate" value="<?= $defaultToDate ?>" required></label>
    <div class="action-buttons">
        <button type="button" id="updateGraphBtn">Update Graphs</button>
        <button type="button" id="updateCsvBtn">Update CSV Preview</button>
        <button type="submit" name="download" value="1">Download Data</button>
    </div>
</form>

<div class="date-range-info" id="dateRangeInfo">Showing data from <?= $defaultFromDate ?> to <?= $defaultToDate ?></div>

<div class="summary" id="summaryCards">
    <?php foreach ([
        'Avg Temperature' => 'avg_temp',
        'Max Temperature' => 'max_temp',
        'Min Temperature' => 'min_temp',
        'Avg Wind Speed' => 'avg_wind',
        'Total Rainfall' => 'total_rainfall',
        'Avg Humidity' => 'avg_humidity',
        'Avg Wind Direction' => 'avg_wind_direction'
    ] as $title => $field): ?>
        <div class="card" id="card-<?= $field ?>">
            <h3><?= $title ?></h3>
            <p><?= isset($summary[$field]) ? round($summary[$field], 2) : 'No data' ?></p>
        </div>
    <?php endforeach; ?>
</div>

<canvas id="temperatureChart"></canvas>
<canvas id="windChart"></canvas>
<canvas id="rainChart"></canvas>
<canvas id="humidityChart"></canvas>

<div class="loading" id="loadingIndicator">Loading data, please wait...</div>

<!-- CSV Table Preview -->
<div id="tableContainer">
    <?php if (!empty($_SESSION['table_data'])): ?>
        <h2 style="text-align:center;">
            Detailed Data Table 
            <?php if ($_SESSION['selected_from'] === "Most Recent"): ?>
                (Most Recent 50 Rows)
            <?php else: ?>
                (<?= $_SESSION['selected_from'] ?> to <?= $_SESSION['selected_to'] ?>)
            <?php endif; ?>
        </h2>
        <div class="data-count">Total rows: <?= count($_SESSION['table_data']) ?></div>
        <div style="overflow-x:auto;">
            <table>
                <thead>
                    <tr>
                        <?php foreach (array_keys($_SESSION['table_data'][0]) as $colName): ?>
                            <th><?= htmlspecialchars($colName) ?></th>
                        <?php endforeach; ?>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($_SESSION['table_data'] as $row): ?>
                        <tr>
                            <?php foreach ($row as $value): ?>
                                <td><?= htmlspecialchars($value) ?></td>
                            <?php endforeach; ?>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>

<script>
const initialGraphData = <?= json_encode($graphData) ?>;
let charts = {};

// Set default date range for the form
const defaultFromDate = "<?= $defaultFromDate ?>";
const defaultToDate = "<?= $defaultToDate ?>";

function createWeatherChart(canvasId, label, dataKey, color, data) {
    const labels = data.dates;
    const avgData = data[dataKey].map(d => d.avg);
    const minData = data[dataKey].map(d => d.min);
    const maxData = data[dataKey].map(d => d.max);

    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    charts[canvasId] = new Chart(document.getElementById(canvasId), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: label,
                    data: avgData,
                    borderColor: color,
                    backgroundColor: color,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 2,
                }
            ]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: false } },
            plugins: { legend: { labels: { filter: (item) => item.datasetIndex === 0 } } }
        }
    });
}

// Update summary cards function
function updateSummaryCards(summaryData) {
    const cardMappings = {
        'avg_temp': 'Avg Temperature',
        'max_temp': 'Max Temperature',
        'min_temp': 'Min Temperature',
        'avg_wind': 'Avg Wind Speed',
        'total_rainfall': 'Total Rainfall',
        'avg_humidity': 'Avg Humidity',
        'avg_wind_direction': 'Avg Wind Direction'
    };
    
    for (const [key, value] of Object.entries(summaryData)) {
        const cardElement = document.getElementById(`card-${key}`);
        if (cardElement) {
            const valueElement = cardElement.querySelector('p');
            if (valueElement) {
                valueElement.textContent = value;
            }
        }
    }
}

// Update date range info
function updateDateRangeInfo(from, to) {
    const dateRangeInfo = document.getElementById('dateRangeInfo');
    if (from && to) {
        dateRangeInfo.textContent = `Showing data from ${from} to ${to}`;
    } else {
        dateRangeInfo.textContent = 'Showing data for all available dates';
    }
}

// Show loading indicator
function showLoading() {
    document.getElementById('loadingIndicator').style.display = 'block';
}

// Hide loading indicator
function hideLoading() {
    document.getElementById('loadingIndicator').style.display = 'none';
}

// Initial load
createWeatherChart('temperatureChart', 'Average Temperature (°C)', 'temperature', 'red', initialGraphData);
createWeatherChart('windChart', 'Average Wind Speed (m/s)', 'wind', 'blue', initialGraphData);
createWeatherChart('rainChart', 'Rainfall (mm)', 'rain', 'lightblue', initialGraphData);
createWeatherChart('humidityChart', 'Average Humidity (%)', 'humidity', 'green', initialGraphData);

// Update Graphs button event listener
document.getElementById('updateGraphBtn').addEventListener('click', function () {
    const from = document.getElementById('fromDate').value;
    const to = document.getElementById('toDate').value;

    if (!from || !to) {
        alert('Please select both From and To dates.');
        return;
    }

    showLoading();
    fetch(`?ajax=1&from=${from}&to=${to}`)
        .then(response => response.json())
        .then(data => {
            hideLoading();
            if (data.error) {
                alert(data.error);
            } else {
                // Update graphs
                createWeatherChart('temperatureChart', 'Average Temperature (°C)', 'temperature', 'red', data.graphData);
                createWeatherChart('windChart', 'Average Wind Speed (m/s)', 'wind', 'blue', data.graphData);
                createWeatherChart('rainChart', 'Rainfall (mm)', 'rain', 'lightblue', data.graphData);
                createWeatherChart('humidityChart', 'Average Humidity (%)', 'humidity', 'green', data.graphData);
                
                // Update summary cards
                updateSummaryCards(data.summary);
                
                // Update date range info
                updateDateRangeInfo(from, to);
            }
        })
        .catch(error => {
            hideLoading();
            console.error('Error fetching data:', error);
            alert('Failed to update dashboard.');
        });
});

// Update CSV Preview button event listener
document.getElementById('updateCsvBtn').addEventListener('click', function () {
    const from = document.getElementById('fromDate').value;
    const to = document.getElementById('toDate').value;

    if (!from || !to) {
        alert('Please select both From and To dates.');
        return;
    }

    showLoading();
    fetch(`?update_preview=1&from=${from}&to=${to}`)
        .then(response => response.json())
        .then(data => {
            hideLoading();
            if (data.error) {
                alert(data.error);
            } else {
                // Update table container with new HTML
                document.getElementById('tableContainer').innerHTML = data.html;
                
                // Add row count
                const countDiv = document.createElement('div');
                countDiv.className = 'data-count';
                countDiv.textContent = `Total rows: ${data.count}`;
                document.getElementById('tableContainer').insertBefore(countDiv, document.getElementById('tableContainer').firstChild.nextSibling);
            }
        })
        .catch(error => {
            hideLoading();
            console.error('Error fetching data:', error);
            alert('Failed to update CSV preview.');
        });
});
</script>

</body>
</html>