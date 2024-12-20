
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Item from '../interface/Item';

interface MyProp {
  itemsIn: Item[];
}


export default function BasicTable(props: MyProp) {

  // Estado para el arreglo de filas
  const [rows, setRows] = useState<Item[]>([]);

  useEffect(() => {
    setRows(props.itemsIn)
  }, [props]);


  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
        <TableCell align="center">Hora de inicio</TableCell>
            <TableCell align="center">Hora de fin</TableCell>
            <TableCell align="center">Temperatura</TableCell>
            <TableCell align="center">Humedad</TableCell>
            <TableCell align="center">Condición</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
               
              <TableCell align="center" component="th" scope="row">
                {row.timeStart || "Sin informacion"}
              </TableCell>
              <TableCell align="center">{row.timeEnd}</TableCell>
              <TableCell align="center">{row.temperature}</TableCell>
              <TableCell align="center">{row.humidity}</TableCell>
              <TableCell align="center">
            {/* Mostrar el ícono con el texto alternativo */}
            {row.condition ? (
              <img
                src={row.condition}
                alt={row.condition || "Condición no disponible"}
                style={{ width: 40, height: 40 }}
              />
            ) : (
              "Sin icono"
            )}
          </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}