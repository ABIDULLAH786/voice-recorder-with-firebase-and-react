import SimpleAlert from "../utils/simpleAlert";

export async function startRecording(setRecorderState) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    setRecorderState((prevState) => {
      return {
        ...prevState,
        initRecording: true,
        mediaStream: stream,
      };
    });
  } catch (err) {
    SimpleAlert("Error", "Error while starting audio recording", "error", "1500");

  }
}

export function saveRecording(recorder) {
  if (recorder.state !== "inactive") recorder.stop();
}
