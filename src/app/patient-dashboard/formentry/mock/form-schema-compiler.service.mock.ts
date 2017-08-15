import { Injectable } from '@angular/core';

@Injectable()
export class FakeFormSchemaCompiler {
  constructor() {
  }

  public compileFormSchema(formSchema: object, referencedComponents: object): object {
    return {
      compiled: true,
      formSchema: formSchema,
      referencedComponents: referencedComponents
    };
  }
}
