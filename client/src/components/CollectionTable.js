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
import BaseURIModal from "./BaseURIModal";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(LocalizedFormat);

export default function CollectionTable({
  rows,
  deleteCollection,
  handleNavigate,
  downloadNFT,
}) {
  const [modalState, setModalState] = useState({
    open: false,
    collectionId: "",
    collectionName: "",
  });
  const handleOpen = (collectionId, collectionName) =>
    setModalState({
      open: true,
      collectionId: collectionId,
      collectionName: collectionName,
    });
  const handleClose = () =>
    setModalState({ open: false, collectionId: "", collectionName: "" });

  const [URImodalState, setURIModalState] = useState({
    open: false,
    collectionId: "",
  });
  const handleOpenURI = (collectionId) =>
    setURIModalState({
      open: true,
      collectionId: collectionId,
    });
  const handleCloseURI = () =>
    setURIModalState({ open: false, collectionId: "" });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell align="right">Collection</TableCell>
            <TableCell align="right">Created at</TableCell>

            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows &&
            rows.map((row, index) => (
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
                  {row.collectionName
                    .substring(0, row.collectionName.length - 4)
                    .toUpperCase()}
                </TableCell>
                <TableCell onClick={() => handleNavigate(row.id)} align="right">
                  {dayjs(row.createdAt).format("L LT")}
                </TableCell>

                <TableCell align="right">
                  {row.isNFTGenerated && (
                    <>
                      <Button
                        variant="text"
                        onClick={() => downloadNFT(row.id)}
                      >
                        <CloudDownloadIcon />
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => handleOpenURI(row.id)}
                      >
                        IPFS
                      </Button>
                    </>
                  )}

                  <Button variant="text" component="label">
                    <DeleteForeverIcon />
                    <button
                      hidden
                      onClick={() =>
                        deleteCollection(row.id, row.collectionName, index)
                      }
                    />
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => handleOpen(row.id, row.collectionName)}
                  >
                    Generate NFT
                  </Button>

                  <BasicModal
                    open={modalState.open}
                    handleClose={handleClose}
                    collectionId={modalState.collectionId}
                    collectionName={modalState.collectionName}
                  />
                  <BaseURIModal
                    open={URImodalState.open}
                    handleClose={handleCloseURI}
                    collectionId={URImodalState.collectionId}
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
