import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';



function Row(props) {
  const { rows } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton 
            aria-label="expand row"
            size="small" style={{ backgroundColor: open ? '#673ab7' : 'transparent',color: open ? 'white' : 'inherit',padding: '4px' }}
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" style={{ textTransform: 'uppercase', fontWeight: 'bold',width:'100%',height:'100%' }}>
          {rows[0].asset_class}({rows.length}) 
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }} >
            <div className='hello'>
              <Table size="small" >
                <TableHead >
                <TableRow  >
                <TableCell style={{ fontSize: '10px', color: 'grey' }}>NAME OF THE HOLDING</TableCell>
                <TableCell style={{ fontSize: '10px', color: 'grey' }}>TICKER</TableCell>
                <TableCell style={{ fontSize: '10px', color: 'grey' }}>AVERAGE PRICE</TableCell>
                <TableCell style={{ fontSize: '10px', color: 'grey' }}>MARKET PRICE</TableCell>
                <TableCell style={{ fontSize: '10px', color: 'grey' }}>LAST CHANGE PERCENTAGE</TableCell>
                <TableCell style={{ fontSize: '10px', color: 'grey' }}>MARKET VALUE IN BASE CCY</TableCell>
                </TableRow>
                </TableHead>
                <TableBody >
                  {rows.map((row,index) => (
                    <TableRow key={row.name} className={index % 2 === 0 ? 'light-row' : 'white-row'}>
                      <TableCell component="th" scope="row"  style={{ fontSize: '7.4px'}}>
                        {row.name} 
                      </TableCell>
                      <TableCell style={{ fontSize: '7.4px'}}>{row.ticker}</TableCell>
                      <TableCell style={{ fontSize: '7.4px'}}>{!row.avg_price ? 'N/A' : row.avg_price}</TableCell>
                      <TableCell style={{ fontSize: '7.4px'}}>
                        {!row.market_price ? 'N/A' : row.market_price}
                      </TableCell>
                      <TableCell  style={{ color: row.latest_chg_pct < 0 ? 'red' : 'inherit', fontSize: '7.4px'}} >{row.latest_chg_pct}</TableCell>
                      <TableCell style={{ fontSize: '7.4px'}}>{row.market_value_ccy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}


export default function Container() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('https://canopy-frontend-task.vercel.app/api/holdings');
      setData(result.data.payload);
    };

    fetchData();
  }, []);

  const groupedData = {};
  if (data) {
    data.forEach((row) => {
      if (!groupedData[row.asset_class]) {
        groupedData[row.asset_class] = [];
      }
      groupedData[row.asset_class].push(row);
    });
  }


  return (
    <TableContainer component={Paper}>
    <Table aria-label="collapsible table">
      <TableBody>
        {groupedData && Object.entries(groupedData).map(([assetClass, rows]) => (
          <Row key={assetClass} rows={rows} />
        ))}
      </TableBody>
    </Table>
  </TableContainer>

  );
}
