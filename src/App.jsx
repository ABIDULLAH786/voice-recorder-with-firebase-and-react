import RecorderControls from "./components/recorder-controls";
import RecordingsList from "./components/recordings-list";
import useRecorder from "./hooks/useRecorder";
import { useEffect, useState } from "react";
export default function App() {
  const [percent, setPercent] = useState(0);
  const { recorderState, ...handlers } = useRecorder();
  const { audio } = recorderState;
  
  useEffect(() => {
    if (percent === 100) {
      setPercent(0);
    }
  }, [percent]);
  
  return (
    <section className="bg-teal-100 min-h-screen">
      <h1 className="text-center py-4 font-semibold text-3xl">
        Voice Recorder
      </h1>
      <div className=" flex justify-center">
        <div className="bg-teal-600 mx-10 md:mx-0 md:w-1/2 p-5 rounded-lg">
          <RecorderControls recorderState={recorderState} handlers={handlers} />
          <RecordingsList/>
        </div>
      </div>
    </section>
  );
}
