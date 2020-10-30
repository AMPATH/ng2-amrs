export default class LabAdapterError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.name = 'LabAdapterError';
  }
}
