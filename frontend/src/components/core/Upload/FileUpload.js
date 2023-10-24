import React from "react";
import Dropzone from "react-dropzone";

// for pdf files
class FileUpload extends React.Component {
  state = { warningMsg: "" };

  onDrop = (accepted, rejected) => {
    if (Object.keys(rejected).length !== 0) {
      const message = "Please submit valid file type";
      this.setState({ warningMsg: message });
    } else {
      this.props.addFile(accepted);
      this.setState({ warningMsg: "" });
      console.log(accepted[0].preview);

      var blobPromise = new Promise((resolve, reject) => {
        const reader = new window.FileReader();
        reader.readAsDataURL(accepted[0]);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
        };
      });
      blobPromise.then(value => {
        console.log(value);
      });
    }
  };

  render() {
    const { files } = this.props;
    const render =
      Object.keys(files).length !== 0 ? (
        files.map(file => <p key={file.name}>{file.name}</p>)
      ) : (
        <p className="hello">Please drop only .PDF, .DOC or .DOCX files</p>
      );

    return (
      <div>
        <p>{this.state.warningMsg}</p>

        <Dropzone
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            border: " 2px dashed"
          }}
          multiple={false}
          accept="application/msword, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onDrop={(accepted, rejected) => this.onDrop(accepted, rejected)}
        >
          {({ isDragAccept, isDragReject, acceptedFiles, rejectedFiles }) => {
            if (isDragReject) return "Please submit a valid file";
            return render;
          }}
        </Dropzone>
      </div>
    );
  }
}

export default FileUpload;