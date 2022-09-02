import { atom } from "recoil";

//? Global variebles

export const modalState = atom({
    key: 'modalstate',
    default: false
});

export const screenState = atom({
    key: 'screenstate',
    default: false
});