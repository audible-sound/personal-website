import Typed from "typed.js";

export default function initWelcomeText(classId: string, greetings: string[], typeSpeed: number = 50) {
    return new Typed(classId, {
        strings: greetings,
        typeSpeed,
        backSpeed: typeSpeed,
        loop: true,
        smartBackspace: true,
        cursorChar: '_'
    });
}