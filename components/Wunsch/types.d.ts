declare global {
    interface WunschBalloon extends HTMLElement {
        animateBalloon(): void;
    }

    interface WunschColorShift extends HTMLElement {
        shift(): void;
    }

    interface WunschPick2 extends HTMLElement {
        animate(): void;
    }
}

export {};