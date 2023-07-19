import RecorderControls from "./components/recorder-controls";
import useRecorder from "./hooks/useRecorder";
import "./App.css";

export default function App() {
  const { recorderState, ...handlers } = useRecorder();
  const { audio } = recorderState;

  return (
    <section className="bg-teal-100 min-h-screen">
      <h1>Voice Recorder</h1>
      <div className=" flex justify-center">
        <div className="bg-teal-600 w-1/2 p-5 rounded-lg">
          <RecorderControls recorderState={recorderState} handlers={handlers} />
        </div>
      </div>
    </section>
  );
}
