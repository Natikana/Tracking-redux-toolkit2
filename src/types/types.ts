export type FieldsErrorsType = {
    field:string
    error:string
}
export type ResponseDataType<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D
    fieldsErrors:FieldsErrorsType[]
}
export enum FilterValuesType {
    all = 'all',
    active = 'active',
    completed = 'completed'
}