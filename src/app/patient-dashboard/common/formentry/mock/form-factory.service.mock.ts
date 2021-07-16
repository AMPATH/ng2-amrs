import { Injectable } from "@angular/core";

@Injectable()
export class FakeFormFactory {
  constructor() {}

  public createForm(formSchema: object): any {
    // TODO: Return Form type
    formSchema = {
      searchNodeByQuestionId: (questionId) => {
        return [
          {
            control: {
              value: ["1"],
            },
          },
        ];
      },
    };
    return formSchema;
  }
}
