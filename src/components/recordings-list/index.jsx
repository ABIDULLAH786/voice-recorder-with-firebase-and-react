import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./styles.css";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { storage } from "../../config/firebaseConfig";
import { deleteObject, ref } from "firebase/storage";
import { deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
export default function RecordingsList() {
  const [fileUrls, setFileUrls] = useState([]);
  const [fileIds, setFileIds] = useState([]);

  useEffect(() => {
    const audioUrlsCollection = collection(db, "audioUrls");

    const unsubscribe = onSnapshot(
      query(audioUrlsCollection),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id, // Store the document ID along with the data
          ...doc.data(),
        }));
        const urls = data.map((item) => item.url);
        const ids = data.map((item) => item.id);

        setFileUrls(urls);
        setFileIds(ids);
      },
      (error) => {
        // Handle error
        console.error("Error fetching audio URLs:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);
  const deleteAudio = async (docId) => {
    try {
      // Get the document from Firestore using the document ID
      const docRef = doc(db, "audioUrls", docId);

      const docSnap = await getDoc(docRef);

      // Retrieve the filename and URL from the document
      const { filename, url } = docSnap.data();
      // Delete the file from Firebase Storage
      const storageRef = ref(storage, url);
      // const storageRef = storage.refFromURL(url);
      await deleteObject(storageRef);

      // Delete the corresponding document from Firestore
      await deleteDoc(docRef);

      console.log("File deleted successfully:", filename);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  return (
    <div className="text-center h-[410px]">
      {fileUrls?.length > 0 ? (
        <>
          <h1 className="font-medium text-xl pb-2">Recordings List</h1>
          <div className="overflow-y-auto max-h-[350px] d-grid lg:px-32 recordings-list ">
            {fileUrls?.map((fileurl, index) => (
              <div className="grid grid-cols-[20px_minmax(300px,_1fr)_1px] items-center space-x-2">
                <h2 className="text-lg font-medium">{index + 1}</h2>
                <div className="flex justify-center p-2 space-x-2" key={index}>
                  <audio controls src={fileurl} />
                  {/* delete button */}
                  <div className="flex items-center">
                    <button
                      className="text-red-600 bg-white w-8 h-8 rounded-full  hover:text-black"
                      title="Delete this audio"
                      onClick={() => deleteAudio(fileIds[index])}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} className="w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <div>
            <FontAwesomeIcon
              icon={faExclamationCircle}
              size="2x"
              color="#f2ea02"
            />
            <h2 className="text-lg font-medium">No voice records found</h2>
          </div>
        </div>
      )}
    </div>
  );
}
