import React from "react";

import {
  DragAndDropFileUploadWithAxios,
  ButtonFileUploadWithAxios
} from "./components";


function App() {
  return (
    <div>
      <DragAndDropFileUploadWithAxios/>
      <ButtonFileUploadWithAxios />
      <input type='file' multiple onChange={(e)=>console.log(e.target.files)}/>
    </div>
  );
}
export default App;
