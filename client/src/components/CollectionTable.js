import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import BasicModal from "../components/Modal";

export default function CollectionTable({
  rows,
  deleteCollection,
  handleNavigate,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
              hover
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                onClick={() => handleNavigate(row.id)}
                component="th"
                scope="row"
              >
                {row.id}
              </TableCell>
              <TableCell onClick={() => handleNavigate(row.id)} align="right">
                {row.collectionName}
              </TableCell>
              <TableCell onClick={() => handleNavigate(row.id)} align="right">
                {row.isNFTGenerated.toString()}
              </TableCell>
              <TableCell onClick={() => handleNavigate(row.id)} align="right">
                {row.createdAt}
              </TableCell>
              <TableCell onClick={() => handleNavigate(row.id)} align="right">
                {row.updatedAt}
              </TableCell>
              <TableCell align="right">
                <Button variant="text" onClick={handleOpen}>
                  Generate NFT
                </Button>
                <Button variant="text" component="label">
                  Delete
                  <button
                    hidden
                    onClick={() =>
                      deleteCollection(row.id, row.collectionName, index)
                    }
                  />
                </Button>
                <BasicModal
                  open={open}
                  handleClose={handleClose}
                  collectionId={row.id}
                  collectionName={row.collectionName}
                />
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
