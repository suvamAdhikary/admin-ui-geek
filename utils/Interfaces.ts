export interface IMember {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface editHandlerProps {
    fieldName: string;
    value: string;
    memberId: string;
  }

export interface deleteHandlerProps {
    memberId: string;
}