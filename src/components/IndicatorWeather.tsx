import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
import Box from '@mui/material/Paper';

interface Indicator {
    title?: String;
    subtitle?: String;
    value?: String;
}
export default function IndicatorWeather(config: Indicator) {
    return (
        <Box
            sx={{
              backgroundColor: "#ffffff", // Fondo oscuro
              color: "#000000", // Texto blanco
              padding: "20px",
              borderRadius: "10px", // Bordes redondeados
              textAlign: "center",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Sombra ligera
            }}
          >
            <Typography variant="h6" gutterBottom>
              {config.title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {config.value}
            </Typography>
            <Typography variant="body2">{config.subtitle}</Typography>
          </Box>
    )
}