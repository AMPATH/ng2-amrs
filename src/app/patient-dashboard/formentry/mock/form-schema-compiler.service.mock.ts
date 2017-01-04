import { Injectable } from '@angular/core';

@Injectable()
export class FakeFormSchemaCompiler {
  constructor() {
  }

  public compileFormSchema(formSchema: Object, referencedComponents: Object): Object {
    return {
      compiled: true,
      formSchema: formSchema,
      referencedComponents: referencedComponents
    };
  }
}
