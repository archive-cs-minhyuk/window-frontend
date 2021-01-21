import React from "react";
import styles from "./App.module.css";

const DragAndDrop = (props) => {
  const { data, dispatch } = props;

  const handleDragEnter = (event) => {
    //우리가 드래그를 하고 있는 도중
    event.preventDefault();
    dispatch({ type: "AddToDropZone", inDropZone: true });
  };

  const handleDragOver = (event) => {
    //PC에서 drop area로의 file copy
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy"; //원래의 위치에서 drop zone으로 copy 될 것 명시
    dispatch({ type: "AddToDropZone", inDropZone: true });
  };

  const handleDrop = (event) => {
    //file을 drop zone에 위치시키는 역할
    event.preventDefault();

    let files = [...event.dataTransfer.files];
    let files_with_preview = [];

    files.map((file) => {
      file["preview"] = URL.createObjectURL(file);
      files_with_preview.push(file);
    });

    if (files) {
      dispatch({ type: "AddToList", files });
      dispatch({ type: "AddToDropZone", inDropZone: false });
    }
  };
  return (
    <div
      className={styles.Zone}
      onDrop={(event) => handleDrop(event)}
      onDragOver={(event) => handleDragOver(event)}
      onDragEnter={(event) => handleDragEnter(event)}
    >
      <p>Drag your files here</p>
      <ol>
        {data.fileList.map((file) => {
          return (
            <li key={file.name}>
              <p>{file.name}</p>
              <img
                src={file.preview}
                alt=""
                style={{ width: 100, height: 100 }}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
};

function App() {
  const state = {
    inDropZone: false,
    fileList: [],
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "AddToDropZone":
        return { ...state, inDropZone: action.inDropZone };
      case "AddToList":
        return {
          ...state,
          fileList: state.fileList.concat(action.files),
        };
      default:
        return state;
    }
  };
  const [data, dispatch] = React.useReducer(reducer, state);

  return (
    <div className={styles.App}>
      <h1>Drag-and-drop practice</h1>
      <DragAndDrop data={data} dispatch={dispatch} />
      <ol className="dropped-files">
        {data.fileList.map((file) => {
          return <li key={file.name}>{file.name}</li>;
        })}
      </ol>
    </div>
  );
}

export default App;
