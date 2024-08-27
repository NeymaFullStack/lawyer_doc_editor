import { NativeEventSource, EventSourcePolyfill } from "event-source-polyfill";

const EventSource = EventSourcePolyfill;
export default EventSource;
// OR: may also need to set as global property
