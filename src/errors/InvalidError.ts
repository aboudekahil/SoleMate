export class InvalidError extends Error {
  constructor(private errors: ErrorBundle[]) {
    super();
  }

  public toString = (): string => {
    const errors = this.errors.map((error) => {
      return {
        title: error.title,
        message: error.message,
      };
    });

    return JSON.stringify(errors);
  };
}
