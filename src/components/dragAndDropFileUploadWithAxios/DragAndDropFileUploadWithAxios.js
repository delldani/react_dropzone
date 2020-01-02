import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const DragAndDropFileUploadWithAxios = props => {
  const {
    url,
    defaultStyle,
    selectedFilesFieldName,
    labelText,
    progressFunction,
    getSelectedFilesBeforeFilter,
    getSelectedFilesAfterFilter,
    filterFunction
  } = props;

  let fieldDatas;
  const feedFieldDatasWithDefault = () => (fieldDatas = [...props.fieldDatas]);

  const addSelectedFilesToFieldData = files => {
    feedFieldDatasWithDefault();
    for (const file of files)
      fieldDatas.push({ [selectedFilesFieldName]: file });
  };

  const onDrop = acceptedFiles => {
    getSelectedFilesBeforeFilter(acceptedFiles);
    const filteredFiles = filterFiles(acceptedFiles);
    getSelectedFilesAfterFilter(filteredFiles);
    addSelectedFilesToFieldData(filteredFiles);
    sendFiles();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  //axios rendelkezik ezekkel az eventekkel, amik mutatják hogy, hogy áll a feltöltés
  const config = {
    onUploadProgress: progressEvent => {
      if (progressEvent.lengthComputable)
        progressFunction(
          Math.round((progressEvent.loaded * 100) / progressEvent.total)
        );
    }
  };

  const makeFormData = () => {
    let formData = new FormData();
    fieldDatas.forEach(element => {
      for (let key in element) formData.append(key, element[key]);
    });
    //formData-hoz hozzáfűzi a fieldek nevét és értékeit
    //FONTOS ha több file van kijelölve akkor azokat ugyanazzal a field névvel
    //kell elmenteni, a szerver oldalon pedig meg kell adni ezt a nevet amiből tudni fogja, hogy ezek a keresett fájlok
    return formData;
  };

  const filterFiles = files => Object.values(files).filter(filterFunction);

  async function sendFiles() {
    axios
      .post(url, makeFormData(), config)
      .then(response => {
        if (response.status === 200) {
          feedFieldDatasWithDefault(); //visszaállítja az eredeti adatokat, hogy lehessen újra kijelölni fájlokat
          console.log("mentés ok !");
        } else console.log("Szerver oldali hiba !");
      })
      .catch(err => console.log(err));
  }

  return (
    <div {...getRootProps()} style={defaultStyle}>
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the files here ...</p> : <p>{labelText}</p>}
    </div>
  );
};

DragAndDropFileUploadWithAxios.defaultProps = {
  url: "http://localhost:3000/pictures",
  defaultStyle: { padding: "50px" },
  multiple: true,
  fieldDatas: [{ text: "valami meta-adat.." }],
  selectedFilesFieldName: "avatar",
  labelText: "Drag 'n' drop some files here, or click to select files",
  buttonText: "Send to server",
  progressFunction: loadedData => {
    console.log(loadedData);
  },
  getSelectedFilesBeforeFilter: selectedFiles => {
    console.log(selectedFiles);
  },
  getSelectedFilesAfterFilter: selectedFiles => {
    console.log("kiválasztott file-ok szűrés után : ");
    console.log(selectedFiles);
  },
  filterFunction: selectedFile => true
};

export default DragAndDropFileUploadWithAxios;
