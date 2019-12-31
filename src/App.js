import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

import {
  DragAndDropFileUploadWithAxios,
  ButtonFileUploadWithAxios
} from "./components";

const StyledDiv = styled.div`
  padding: 4em;
  background: papayawhip;
`;
function App() {
  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <StyledDiv {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </StyledDiv>
      <DragAndDropFileUploadWithAxios />
      <ButtonFileUploadWithAxios />
    </div>
  );
}
export default App;
