export default class LabResultFormatError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.name = 'LabResultFormatError';
  }
}
