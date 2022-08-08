import { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link } from "react-router-dom";

export default function MainNav() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab component={Link} label="Collections" to="collection" />
        <Tab component={Link} label="Attributes" to="collection" />
        <Tab component={Link} label="NFTs" to="collection" />
      </Tabs>
    </Box>
  );
}
