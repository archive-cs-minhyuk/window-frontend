import React, { useState } from "react";
import styles from "./App.module.css";

const DragAndDrop = (props) => {
  const { data, dispatch, attachment } = props;

  const handleDragEnter = (event) => {
    //우리가 드래그를 하고 있는 도중. zone에 처음 들어갔을 때 발생
    event.preventDefault();
    dispatch({ type: "AddToDropZone", inDropZone: true });
  };

  const handleDragOver = (event) => {
    //PC에서 drop area로의 file copy. zone안에서 움직일 때 계속 발생
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy"; //원래의 위치에서 drop zone으로 copy 될 것 명시
    dispatch({ type: "AddToDropZone", inDropZone: true });
  };

  const handleDrop = (event) => {
    //file을 drop zone에 위치시키는 역할. zone에서 마우스 놨을 때
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
  const onClick = (event) => {
    console.log(event);
  };
  let myURL = "";
  if (attachment === "") {
    myURL = null;
  } else {
    myURL = attachment;
  }
  return (
    <div
      className={styles.Zone}
      onDrop={(event) => handleDrop(event)}
      onDragOver={(event) => handleDragOver(event)}
      onDragEnter={(event) => handleDragEnter(event)}
    >
      <ul className={styles.list_ul}>
        {data.fileList.map((file) => {
          return (
            <li key={file.name}>
              <img
                src={file.preview}
                alt="ss"
                style={{ width: 400, height: 400 }}
                onClick={onClick}
              />
            </li>
          );
        })}
        {attachment && (
          <li>
            <img src={myURL} style={{ width: 400, height: 400 }} alt="" />
          </li>
        )}
      </ul>
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
  const [attachment, setAttachment] = useState("");
  const [inputWidth, setInputWidth] = useState("");
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setInputWidth(value);
  };
  const onSubmit = (event) => {
    event.preventDefault();
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  return (
    <>
      <header>
        <input
          type="file"
          onChange={onFileChange}
          className={styles.file_button}
        ></input>
        <button className={styles.fake_button}>Click left</button>
        <span className={styles.unitarea}>Unit Area:</span>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="넓이 입력"
            value={inputWidth}
            onChange={onChange}
          />
          <select name="unit">
            <option value="mm2">mm{"\xB2"} </option>
            <option value="cm2">cm{"\xB2"} </option>
            <option value="m2">m{"\xB2"} </option>
          </select>
        </form>
      </header>
      <div className={styles.App}>
        <DragAndDrop data={data} dispatch={dispatch} attachment={attachment} />
      </div>
    </>
  );
}

export default App;
