import * as React from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

export default function UploadComponent({ onChange, onSubmit }) {
  return (
    <form method="post" action="#" onSubmit={onSubmit}>
      <Button variant="text" component="label">
        Upload
        <input
          hidden
          accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
          type="file"
          onChange={onChange}
        />
      </Button>
      <Button variant="contained" component="label">
        Submit
        <button hidden type="submit"></button>
      </Button>
    </form>
  );
}

UploadComponent.propTypes = {
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

UploadComponent.defaultProps = {
  // eslint-disable-next-line no-console
  onChange: console.log,
  onSubmit: console.log,
};
