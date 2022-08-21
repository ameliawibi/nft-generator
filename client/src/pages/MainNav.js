import { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";

import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function MainNav() {
  const [value, setValue] = useState(0);
  const { onLogout, token } = useAuth();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {token && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            bgcolor: "background.paper",
          }}
        >
          <Tabs value={value} onChange={handleChange} centered>
            <Tab component={Link} label="Collection" to="collection" />
            <Tab component={Link} label="NFT" to="nft" />
          </Tabs>
          <Button variant="contained" onClick={onLogout}>
            Sign Out
          </Button>
        </Box>
      )}
    </>
  );
}
