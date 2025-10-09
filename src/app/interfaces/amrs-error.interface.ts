export interface GlobalError {
  code: string;
  message: string;
}
export interface AmrsErrorResponse {
  message: string;
  error: {
    error: {
      message: string;
      code: string;
      globalErrors?: GlobalError[];
      fieldErrors?: any;
    };
  };
}
