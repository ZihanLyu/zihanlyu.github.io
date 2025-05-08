-- Create and use the database
CREATE DATABASE IF NOT EXISTS Weather;
USE Weather;

-- Create table if it doesn't already exist
CREATE TABLE IF NOT EXISTS whately2023 (
  timestamp datetime PRIMARY KEY,
  AverageTemp decimal(6,1) DEFAULT NULL,
  AverageWindSpeed decimal(6,1) DEFAULT NULL,
  WindDirection decimal(8,1) DEFAULT NULL,
  AverageRelHumidity decimal(6,1) DEFAULT NULL,
  AtmosPressure int DEFAULT NULL,
  AverageSolarRadiation decimal(8,2) DEFAULT NULL,
  DailyRain decimal(6,2) DEFAULT NULL
);

-- Allow local file loading (for this session)
SET GLOBAL local_infile = 1;

-- Load the data from CSV
LOAD DATA LOCAL INFILE '/Users/r3ttalynn/Desktop/2023_10min.csv'
IGNORE INTO TABLE whately2023
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(
    @timestamp,
    @avg_temp_c,
    @avg_windspeed_mps,
    @wind_direction_deg,
    @avg_rel_humidity_percent,
    @atmos_pressure_mb,
    @avg_solar_rad_w,
    @daily_rain_mm
)
SET
    timestamp = CASE
        WHEN @timestamp REGEXP '^[0-9]{1,2}/[0-9]{1,2}/[0-9]{2} [0-9]{1,2}:[0-9]{2}$'
        THEN STR_TO_DATE(@timestamp, '%c/%e/%y %H:%i')
        ELSE NULL
    END,
    AverageTemp = IF(TRIM(@avg_temp_c) = '', NULL, CAST(@avg_temp_c AS DECIMAL(6,1))),
    AverageWindSpeed = IF(TRIM(@avg_windspeed_mps) = '', NULL, CAST(@avg_windspeed_mps AS DECIMAL(6,1))),
    WindDirection = IF(TRIM(@wind_direction_deg) = '', NULL, CAST(@wind_direction_deg AS DECIMAL(8,1))),
    AverageRelHumidity = IF(TRIM(@avg_rel_humidity_percent) = '', NULL, CAST(@avg_rel_humidity_percent AS DECIMAL(6,1))),
    AtmosPressure = NULLIF(TRIM(@atmos_pressure_mb), ''),
    AverageSolarRadiation = IF(TRIM(@avg_solar_rad_w) = '', NULL, CAST(@avg_solar_rad_w AS DECIMAL(8,2))),
    DailyRain = IF(TRIM(@daily_rain_mm) = '', NULL, CAST(@daily_rain_mm AS DECIMAL(6,2)));

-- Remove rows with invalid timestamps
DELETE FROM whately2023
WHERE timestamp IS NULL;

SET SQL_SAFE_UPDATES = 0;

-- ✅ Post-load rounding to proper precision
UPDATE whately2023
SET 
  AverageTemp = ROUND(AverageTemp, 1),
  AverageWindSpeed = ROUND(AverageWindSpeed, 1),
  WindDirection = ROUND(WindDirection, 1),
  AverageRelHumidity = ROUND(AverageRelHumidity, 1),
  AverageSolarRadiation = ROUND(AverageSolarRadiation, 2),
  DailyRain = ROUND(DailyRain, 2);
  
  SET SQL_SAFE_UPDATES = 1;

-- View first 10 entries to verify
SELECT 
    timestamp,
    FORMAT(AverageTemp, 1) AS AverageTemp,  -- Display 1 decimal
    FORMAT(AverageWindSpeed, 1) AS AverageWindSpeed,  -- Display 1 decimal
    FORMAT(WindDirection, 1) AS WindDirection,  -- Display 1 decimal
    FORMAT(AverageRelHumidity, 1) AS AverageRelHumidity,  -- Display 1 decimal
    FORMAT(AverageSolarRadiation, 2) AS AverageSolarRadiation,  -- Display 2 decimals
    FORMAT(DailyRain, 2) AS DailyRain  -- Display 2 decimals
FROM whately2023;

ALTER TABLE whately2023
MODIFY AverageTemp decimal(6,1),
MODIFY AverageWindSpeed decimal(6,1),
MODIFY WindDirection decimal(6,1),
MODIFY AverageRelHumidity decimal(6,1),
MODIFY AverageSolarRadiation decimal(8,2),
MODIFY DailyRain decimal(6,2);

