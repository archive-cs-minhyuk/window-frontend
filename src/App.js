import React, { useState } from "react";
import styles from "./App.module.css";
import Resizer from "react-image-file-resizer";

const DragAndDrop = (props) => {
  const { data, dispatch, attachment, mysize } = props;

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
  let myURL = ""; //클릭으로 upload한 file
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
              <img src={file.preview} alt="" style={mysize} onClick={onClick} />
            </li>
          );
        })}
        {attachment && (
          <li>
            <img src={myURL} style={mysize} alt="" />
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
  const [unit, setUnit] = useState("");
  const [mysize, setMySize] = useState({ width: 600, height: 450 });
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setInputWidth(value);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    console.log(event);
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
  const onUnitChange = (event) => {
    const {
      target: { value },
    } = event;
    setUnit(value);
  };
  const onBigClick = (event) => {
    const newwidth = mysize.width * 1.5;
    const newheight = mysize.height * 1.5;
    if (newwidth < 2400 && (attachment !== "" || data.fileList.length !== 0)) {
      //사진 있을때만 하기 위해. attachment -> 클릭으로 업로드. fileList -> 드래그로 업로드
      setMySize({ width: newwidth, height: newheight });
    }
  };
  const onSmallClick = (event) => {
    const newwidth = (mysize.width * 2) / 3;
    const newheight = (mysize.height * 2) / 3;
    if (newwidth > 100 && (attachment !== "" || data.fileList.length !== 0)) {
      setMySize({ width: newwidth, height: newheight });
    }
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
        <form onSubmit={onSubmit}>
          <label className={styles.unitarea}>Unit Area:</label>
          <input
            type="text"
            placeholder="넓이 입력"
            value={inputWidth}
            onChange={onChange}
          />
          <select value={unit} onChange={onUnitChange}>
            <option value="" selected dispatch hidden>
              단위 선택
            </option>
            <option value="mm">mm{"\xB2"} </option>
            <option value="cm">cm{"\xB2"} </option>
            <option value="m">m{"\xB2"} </option>
          </select>
        </form>
        <div>
          <button onClick={onBigClick}>확대</button>
          <button onClick={onSmallClick}>축소</button>
        </div>
      </header>
      <div className={styles.App}>
        <DragAndDrop
          data={data}
          dispatch={dispatch}
          attachment={attachment}
          mysize={mysize}
        />
      </div>
      <footer>
        <label>Target Area:</label>
        {inputWidth}
        {unit && (
          <span>
            {unit}
            {"\xB2"}
          </span>
        )}
      </footer>
    </>
  );
}

export default App;
