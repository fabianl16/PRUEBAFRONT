export interface IUser {
    name: string;
    email: string;
    birthDay? : string;
    sign: string;
    phone: string;
    phoneNumberPrefix: string;
    id: number;
}

export type createUserDto = Omit<IUser,'id'>
