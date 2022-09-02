import { atom } from "recoil";

export const modalState = atom({
    key: 'modalstate',
    default: false
});

export const screenState = atom({
    key: 'screenstate',
    default: false
});