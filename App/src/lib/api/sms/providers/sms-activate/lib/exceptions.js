class SMSActivateError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

class InvalidAPIKey extends SMSActivateError {}
class NoBalance extends SMSActivateError {}
class BadStatus extends SMSActivateError {}
class InvalidAction extends SMSActivateError {}
class InvalidData extends SMSActivateError {}
class BannedUser extends SMSActivateError {}
class NoFreeNumbers extends SMSActivateError {}
class BadService extends SMSActivateError {}
class SQLError extends SMSActivateError {}
class InvalidActivation extends SMSActivateError {}

module.exports = {
  InvalidAPIKey,
  NoBalance,
  InvalidAction,
  NoFreeNumbers,
  InvalidData,
  BadService,
  BannedUser,
  SQLError,
  InvalidActivation,
  BadStatus,
};
