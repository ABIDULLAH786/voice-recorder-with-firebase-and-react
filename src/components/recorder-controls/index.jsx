import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faTimes,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { formatMinutes, formatSeconds } from "../../utils/format-time";

export default function RecorderControls({ recorderState, handlers }) {
  const { recordingMinutes, recordingSeconds, initRecording } = recorderState;
  const { startRecording, saveRecording, cancelRecording } = handlers;

  return (
    <div className="flex justify-between w-full">
      {/* timmer and cancel button */}
      <div className="flex items-center justify-between space-x-5">
        <div className="flex  items-center space-x-2 ">
          {initRecording && (
            <div>
              <span class="relative flex h-3 w-3">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
              </span>
            </div>
          )}
          <div>
            <span>{formatMinutes(recordingMinutes)}</span>
            <span>:</span>
            <span>{formatSeconds(recordingSeconds)}</span>
          </div>
        </div>
        {initRecording && (
          <button
            className="hover:text-red-600"
            title="Cancel recording"
            onClick={cancelRecording}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>
      {/* recording and save button */}
      <div className="">
        {initRecording ? (
          <button
            className="hover:text-white"
            title="Save recording"
            disabled={recordingSeconds === 0}
            onClick={saveRecording}
          >
            <FontAwesomeIcon icon={faSave} size="1x" />
          </button>
        ) : (
          <button
            className="hover:text-white"
            title="Start recording"
            onClick={startRecording}
          >
            <FontAwesomeIcon icon={faMicrophone} size="1x" />
          </button>
        )}
      </div>
    </div>
  );
}
