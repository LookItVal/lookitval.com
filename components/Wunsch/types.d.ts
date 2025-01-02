declare global {
    interface WunschBalloon extends HTMLElement {
        animateBalloon(): void;
    }

    interface WunschColorShift extends HTMLElement {
        shift(): void;
    }

    interface WunschPick3 extends HTMLElement {
        animate(): void;
    }
}

export {};