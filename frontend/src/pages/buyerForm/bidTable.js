import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import axios from 'axios'

function createData(bidId, dataCid) {
  return { bidId, dataCid }
}

// export default function FetchId() {
//   const [Id, setId] = useState([])
//   useEffect(() => {
//     idData()
//   }, [])

//   const idData = async () => {
//     const { data } = await axios.get('http://localhost:3000/buyer/api')
//     setId(data)
//   }
// }

const idData = [createData(150, 160), createData(170, 180)]

export default function BidTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 65 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Bid ID</TableCell>
            <TableCell align='right'>Data CID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {idData.map(id => (
            <TableRow key={id.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component='th' scope='row'>
                {id.bidId}
              </TableCell>
              <TableCell align='right'>{id.dataCid}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
