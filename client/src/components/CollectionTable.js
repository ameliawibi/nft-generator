import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

export default function CollectionTable({ rows, deleteCollection }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell align="right">Collection</TableCell>
            <TableCell align="right">isNFTGenerated</TableCell>
            <TableCell align="right">Created at</TableCell>
            <TableCell align="right">Updated at</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.collectionName}</TableCell>
              <TableCell align="right">
                {row.isNFTGenerated.toString()}
              </TableCell>
              <TableCell align="right">{row.createdAt}</TableCell>
              <TableCell align="right">{row.updatedAt}</TableCell>
              <TableCell align="right">
                <Button variant="text" component="label">
                  Delete
                  <button
                    hidden
                    onClick={() =>
                      deleteCollection(row.id, row.collectionName, index)
                    }
                  />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CollectionTable.propTypes = {
  deleteCollection: PropTypes.func,
  rows: PropTypes.array,
};

CollectionTable.defaultProps = {
  // eslint-disable-next-line no-console
  deleteCollection: console.log,
  rows: [
    {
      id: "fail",
      collectionName: "fail",
      userId: "fail",
      isNFTGenerated: "fail",
      createdAt: "fail",
      updatedAt: "fail",
    },
    {
      id: "fail",
      collectionName: "fail",
      userId: "fail",
      isNFTGenerated: "fail",
      createdAt: "fail",
      updatedAt: "fail",
    },
  ],
};
