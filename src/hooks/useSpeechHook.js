import React, { useCallback, useEffect, useState } from "react";

function useSpeechHook(recognition) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscipt] = useState("");
  const handleResult = useCallback((event) => {
    const transcript = event.results[0][0].transcript;
    setTranscipt(transcript);
    // appDispatch(documentAction.setGptQuery(transcript));
  }, []);

  const startListening = useCallback(() => {
    setListening(true);
    recognition.start();
  }, [recognition]);

  const stopListening = useCallback(() => {
    setListening(false);
    recognition.stop();
  }, [recognition]);

  useEffect(() => {
    recognition.onend = stopListening;
    recognition.onresult = handleResult;

    return () => {
      recognition.onend = null;
      recognition.onresult = null;
      recognition.stop();
    };
  }, [recognition, startListening, stopListening, handleResult]);
  return [startListening, stopListening, listening, transcript];
}

export default useSpeechHook;
