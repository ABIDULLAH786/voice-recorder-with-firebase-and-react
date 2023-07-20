import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./styles.css";
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { storage } from "../../config/firebaseConfig";
import { deleteObject, ref } from "firebase/storage";
import { deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import SimpleAlert from "../../utils/simpleAlert";
const PAGE_LIMIT = 10;

export default function RecordingsList() {
  const [fileUrls, setFileUrls] = useState([]);
  const [fileIds, setFileIds] = useState([]);
  const [recordsToShow, setRecordsToShow] = useState(PAGE_LIMIT); // State variable to control the number of records to show
  const [totalVoiceRecords, setTotalVoiceRecords] = useState(0);
  const handleLoadMore = () => {
    if (recordsToShow <= totalVoiceRecords) {
      setRecordsToShow(recordsToShow + PAGE_LIMIT);
    }
  };
  useEffect(() => {
    const audioUrlsCollection = collection(db, "audioUrls");
    // to get total voice records
    const unsubscribeCoutAPI = onSnapshot(
      query(audioUrlsCollection),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id, // Store the document ID along with the data
          ...doc.data(),
        }));
        setTotalVoiceRecords(data.length);
      },
      (error) => {
        // Handle error
        SimpleAlert("Error", "Error fetching audio URLs", "error", "1500");

        console.error("Error fetching audio URLs:", error);
      }
    );

    // to get the paginated voice records
    const unsubscribe = onSnapshot(
      query(
        audioUrlsCollection,
        orderBy("createdAt", "desc"),
        limit(recordsToShow)
      ),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id, // Store the document ID along with the data
          ...doc.data(),
        }));

        setFileUrls(data);

        setFileIds(data.map((item) => item.id));
      },
      (error) => {
        // Handle error
        SimpleAlert("Error", "Error fetching audio URLs", "error", "1500");
      }
    );

    return () => {
      unsubscribeCoutAPI();
      unsubscribe();
    };
  }, [recordsToShow]);
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

      SimpleAlert(
        "Successfully",
        "File deleted successfully",
        "success",
        "1500"
      );
    } catch (error) {
      SimpleAlert("Error", "Error whilte deleting file", "error", "1500");
    }
  };
  return (
    <div className="text-center h-[450px]">
      {fileUrls.slice(0, recordsToShow).length > 0 ? (
        <>
          <h1 className="font-medium text-xl pb-2">Recordings List</h1>
          <div className="overflow-y-auto overflow-x-auto max-h-[425px] d-grid lg:px-20 recordings-list ">
            {fileUrls?.map((file, index) => (
              <div className="grid grid-cols-[20px_minmax(300px,_1fr)_1px] items-center space-x-2">
                <h2 className="text-lg font-medium">{index + 1}</h2>
                <div
                  className="flex items-center justify-center p-2 space-x-2"
                  key={index}
                >
                  <span className="mx-3">{file?.filename?.split("-")[0]}</span>
                  <audio controls src={file?.url} />
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

            {/* Load More Button */}
            {totalVoiceRecords > PAGE_LIMIT &&
              recordsToShow >= PAGE_LIMIT &&
              fileUrls.length !== totalVoiceRecords && (
                <div>
                  <button
                    className="bg-blue-500 text-white mt-2 px-4 py-2 rounded"
                    onClick={handleLoadMore}
                  >
                    Load More
                  </button>
                  <div className="font-medium my-2">
                    {fileUrls.length}/{totalVoiceRecords}
                  </div>
                </div>
              )}
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
