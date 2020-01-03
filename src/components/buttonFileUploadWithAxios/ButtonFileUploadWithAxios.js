import React, { useEffect } from "react";
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
    filterFunction,
    sendToApi,
    allowSending
  } = props;

  let fieldDatas;

  const feedFieldDatasWithDefault = () => {
    fieldDatas = [...props.fieldDatas];
  };

  useEffect(() => {
    feedFieldDatasWithDefault();
  });

  const addSelectedFilesToFieldData = selectedFiles => {
    feedFieldDatasWithDefault(); //feltölti a fieldDatas-t a props-ban kapott vagy alapértelmezett adatokkal
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

  const onChange = e => {
    getSelectedFilesBeforeFilter(e.target.files);
    const filteredFiles = filterFiles(e.target.files);
    getSelectedFilesAfterFilter(filteredFiles);
    addSelectedFilesToFieldData(filteredFiles);
    e.target.value = ""; // https://github.com/ngokevin/react-file-reader-input/issues/11 alapesetben ha kijelölsz egy file-t, utána becsukod az ablakot, majd kinyitod újra és kijelölöd ugyanazt
    //akkor nem hívódik meg az onChange() (mivel nem történt változás), ezzel a sorral ez megoldható
  };

  //axios rendelkezik ezekkel az eventekkel, amik mutatják hogy, hogy áll a feltöltés
  const config = {
    onUploadProgress: progressEvent => {
      if (progressEvent.lengthComputable)
        progressFunction(
          Math.round((progressEvent.loaded * 100) / progressEvent.total)
        );
    }
  };

  const sendFiles = e => {
    e.preventDefault();
    allowSending && sendToApi(url, makeFormData(), config);
    feedFieldDatasWithDefault(); // küldés után üríti a fildDatas-t, visszaállítja adefault értékeket..
  };

  return (
    <form onSubmit={sendFiles}>
      <label>
        {labelText}
        <input
          type="file"
          multiple={multiple}
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
  sendToApi: function(url, body, axiosConfigforProgressBar) {
    axios
      .post(url, body, axiosConfigforProgressBar)
      .then(response => {
        if (response.status === 200) {
          console.log("mentés ok !");
        } else console.log("Szerver oldali hiba !");
      })
      .catch(err => console.log(err));
  },
  filterFunction: selectedFile => true,
  allowSending: true
};

export default ButtonFileUploadWithAxios;
