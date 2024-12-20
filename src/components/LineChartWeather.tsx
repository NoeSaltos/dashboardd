import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';

interface LineChartWeatherProps {
    data: { date: string; average: number }[]; // Datos con fecha y promedio
    variable: string; // Variable seleccionada
}

export default function LineChartWeather({ data, variable }: LineChartWeatherProps) {
    // Extraer datos específicos según la variable seleccionada
    const chartData = data.map(item => item.average); // Valores promedio
    const xLabels = data.map(item => item.date);  // Fecha y hora
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >

            {/* Componente para un gráfico de líneas */}
            <LineChart
                  width={800}
                  height={300}
                  series={[{ data: chartData, label: `Promedio de ${variable}` }]}
                  xAxis={[{ scaleType: 'point', data: xLabels }]}
            />
        </Paper>
    );
}