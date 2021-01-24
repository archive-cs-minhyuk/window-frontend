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
  let myURL = ""; //클릭으로 upload한 file
  if (attachment === "") {
    myURL = null;
  } else {
    myURL = attachment;
  }
  const mynum = { width: 600, height: 450 };
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
                alt=""
                style={{ width: 300, height: 450 }}
                onClick={onClick}
              />
            </li>
          );
        })}
        {attachment && (
          <li>
            <img src={myURL} style={mynum} alt="" />
          </li>
        )}
      </ul>
    </div>
  );
};
