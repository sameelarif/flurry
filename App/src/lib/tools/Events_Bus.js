import util from "util";
import events from "events";

const eventEmitter = events.EventEmitter;

function Event() {
  eventEmitter.call(this);
}

util.inherits(Event, eventEmitter);

const eventBus = new Event();

export default eventBus;
