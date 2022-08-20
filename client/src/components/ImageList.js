import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { useState, useEffect } from "react";

export default function StandardImageList(imageData) {
  const breakpoints = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  };

  const getColumns = (width) => {
    if (width < breakpoints.sm) {
      return 2;
    } else if (width < breakpoints.md) {
      return 3;
    } else if (width < breakpoints.lg) {
      return 6;
    } else if (width < breakpoints.xl) {
      return 7;
    } else {
      return 8;
    }
  };

  const [columns, setColumns] = useState(getColumns(window.innerWidth));
  const updateDimensions = () => {
    setColumns(getColumns(window.innerWidth));
  };

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ImageList cols={columns}>
      {imageData.imageData.map((item, index) => (
        <ImageListItem key={index}>
          <img
            src={`${item.SignedUrl}`}
            srcSet={`${item.SignedUrl}`}
            alt={item.Key}
            loading="lazy"
          />
          {item.jsonContent.attributes.map((element, ind) => (
            <ImageListItemBar
              key={ind}
              title={element.value}
              subtitle={<span>{element.trait_type}</span>}
              position="below"
            />
          ))}
        </ImageListItem>
      ))}
    </ImageList>
  );
}
