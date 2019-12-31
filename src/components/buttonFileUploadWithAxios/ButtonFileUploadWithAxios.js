import React from "react";
import axios from "axios";

const ButtonFileUploadWithAxios = props => {
  const {
    url,
    multiple,
    selectedFilesFieldName,
    labelText,
    buttonText,
    progressFunction,
    getSelectedFilesBeforeFilter,
    getSelectedFilesAfterFilter,
    filterFunction
  } = props;

  let fieldDatas;
  const feedFieldDatasWithDefault = () => (fieldDatas = [...props.fieldDatas]);

  const fileInput = React.createRef();

  //axios rendelkezik ezekkel az eventekkel, amik mutatják hogy, hogy áll a feltöltés
  const config = {
    onUploadProgress: progressEvent => {
      if (progressEvent.lengthComputable)
        progressFunction(
          Math.round((progressEvent.loaded * 100) / progressEvent.total)
        );
    }
  };

  const addSelectedFilesToFieldData = selectedFiles => {
    feedFieldDatasWithDefault();
    for (const file of selectedFiles)
      fieldDatas.push({ [selectedFilesFieldName]: file });
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

  const onChange = () => {
    getSelectedFilesBeforeFilter(fileInput.current.files);
    const filteredFiles = filterFiles(fileInput.current.files);
    getSelectedFilesAfterFilter(filteredFiles);
    addSelectedFilesToFieldData(filteredFiles);
  };

  async function sendFiles(event) {
    event.preventDefault();
    axios
      .post(url, makeFormData(), config)
      .then(response => {
        if (response.status === 200) {
          feedFieldDatasWithDefault();
          console.log("mentés ok !");
        } else console.log("Szerver oldali hiba !");
      })
      .catch(err => console.log(err));
  }
  return (
    <form onSubmit={sendFiles}>
      <label>
        {labelText}
        <input
          type="file"
          multiple={multiple}
          ref={fileInput}
          style={{ display: "none" }}
          onChange={onChange}
        />
      </label>
      <br />
      <button type="submit">{buttonText}</button>
    </form>
  );
};

ButtonFileUploadWithAxios.defaultProps = {
  url: "http://localhost:3000/pictures",
  multiple: true,
  fieldDatas: [{ text: "valami meta-adat.." }],
  selectedFilesFieldName: "avatar",
  labelText: "Click here to select files-axios variation",
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

export default ButtonFileUploadWithAxios;
