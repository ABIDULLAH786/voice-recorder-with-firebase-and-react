import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../config/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const uploadFileToFirebaseStorage = async (mediaBlob, filename) => {
    try {
        console.log(filename)
        const metadata = {
            contentType: 'audio/mp3', // Set the correct content type here (e.g., audio/wav, audio/mp3, etc.)
        };
        const storageRef = ref(storage, `/files/${filename}.mp3`);
        const uploadTask = uploadBytesResumable(storageRef, mediaBlob, metadata);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // const percent = Math.round(
                //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                // );

                // update progress
                // setPercent(percent);
            },
            (err) => console.log(err),
            async () => {
                // download url
                const fileUrl = await getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                    return url;
                });
                // Update Firestore collection with the new URL
                await addDoc(collection(db, 'audioUrls'), { url: fileUrl, filename: filename });

            }
        );

    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export default uploadFileToFirebaseStorage;