import { Injectable } from '@angular/core';

@Injectable()
export class FakeFormFactory {
  constructor() {
  }

  public createForm(formSchema: Object): any {
    // TODO: Return Form type
    formSchema = {
      searchNodeByQuestionId: function (questionId) {
        return [];
      }
    };
    return formSchema;
  }


}
