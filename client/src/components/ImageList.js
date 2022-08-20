import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

export default function StandardImageList(imageData) {
  return (
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
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
