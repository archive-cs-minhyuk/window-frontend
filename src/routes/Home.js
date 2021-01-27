import React, { useState } from "react";
import styles from "./Home.module.css";
import DragAndDrop from "./DragAndDrop";

function Home() {
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
  const [replace, setReplace] = useState(true);
  const [line, setLine] = useState(false);
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
  const onReplaceClick = (event) => {
    if (attachment !== "" || data.fileList.length !== 0) {
      //사진 있을때만
      if (replace === true) {
        setReplace(false);
      } else {
        setReplace(true);
      }
    }
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
          <button>초기화</button>
          <button onClick={onReplaceClick}>재배열</button>
          <button>직선</button>
        </div>
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
          replace={replace}
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

export default Home;
