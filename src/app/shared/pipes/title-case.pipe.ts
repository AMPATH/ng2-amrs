import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "titlecase" })
export class TitleCasePipe implements PipeTransform {
  public transform(input: string): string {
    if (!input) {
      return "";
    } else {
      return input.replace(/\w\S*/g, (txt) => {
        const lower = txt.toLowerCase();
        if (lower === "hiv" || lower === "cdm" || lower === "pep") {
          return txt.toUpperCase();
        }

        if (lower === "prep") {
          return "PrEP";
        }
        return txt[0].toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
  }
}
