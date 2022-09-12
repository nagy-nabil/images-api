const uploadImageForm = document.getElementById("uploadImageForm");
const picUpload = document.getElementById("picUpload");
console.log(picUpload,uploadImageForm)
const formData = new FormData();

const handleSubmit = (event) => {
    event.preventDefault();

    for (const file of picUpload.files) {
        formData.append("files", file);
    }

    fetch("http://localhost:8000/image1", {
        method: "post",
        body: formData,
    }).catch((error) => ("Something went wrong!", error));
};

uploadImageForm.addEventListener("submit", handleSubmit);