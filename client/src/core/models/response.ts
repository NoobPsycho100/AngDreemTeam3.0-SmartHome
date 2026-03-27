export class OkResult
{}

export class ValidationErrorResult
{
    constructor(private _validationErrors: {key: string, error: string}[])
    {}

    public get validationErrors(): {key: string, error: string}[] { return this._validationErrors; };
}

export const NullValidationErrorResult: ValidationErrorResult = new ValidationErrorResult([]);