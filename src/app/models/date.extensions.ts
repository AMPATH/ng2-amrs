interface Date {
    toServerTimezoneString():string;
}

Date.prototype.toServerTimezoneString = function(): string {
    return this.toISOString(); //TODO: convert date based on the server timezone stored somewhere
};