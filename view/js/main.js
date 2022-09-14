const uploadImageForm = document.getElementById("uploadImageForm");
const picUpload = document.getElementById("picUpload");//input file
const gallery = document.getElementById('displayedImages');
const submitButton = document.getElementById('submitButton')
const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        console.log(event)
        event.preventDefault();
        const formData = new FormData();
        for (const file of picUpload.files) {
            formData.append("image", file);
        }
        await fetch("/image", {
            method: "post",
            body: formData,
        });
    } catch (err) {
        alert("something went wrong please try again later");
    }
    return false;
};
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            e.preventDefault()
            const img = document.createElement('img');
            img.src=e.target.result
            gallery.appendChild(img);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
async function createGallery() {
    try {
        console.log(gallery)
        let res = await fetch("/image/gallery", {
            method: "get",
        });
        res = await res.json()
        res.images.forEach((image) => {
            const img = document.createElement('img');
            img.src=`/image/${image}`;
            gallery.appendChild(img);
        });
        console.log(res,res.images[0]);
    } catch(err) {
        console.log(err)
    }
}
createGallery()
uploadImageForm.addEventListener("submit", handleSubmit);