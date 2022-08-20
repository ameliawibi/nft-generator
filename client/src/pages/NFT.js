import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ImageList from "../components/ImageList";
import axios from "axios";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function NFT() {
  const [expanded, setExpanded] = useState("panel1");
  const [NFTList, setNFTList] = useState(null);
  const [imageList, setImageList] = useState(null);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
    getAccordionDetails(panel);
  };

  useEffect(() => {
    axios.get(`/collectionWithNFT`).then((res) => {
      setNFTList(res.data.NFTList);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAccordionDetails = (collectionId) => {
    axios.get(`/${collectionId}/getNFTs`).then((res) => {
      setImageList(res.data.imageList);
    });
  };

  return (
    <div>
      {NFTList &&
        NFTList.map((item) => (
          <Accordion
            key={item.id}
            expanded={expanded === item.id}
            onChange={handleChange(item.id)}
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography>Collection {item.id}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {imageList && <ImageList imageData={imageList} />}
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}
