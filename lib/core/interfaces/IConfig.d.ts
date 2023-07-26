export default interface IConfig {
    /**
     * The current version of Pamyu
     */
    pamyuVersion: string;
    /**
     * If the environment is pamyu development
     * /!\ Do not use this unless you know what you are doing
     * @default false
     */
    pamyuDevEnv: boolean;
    /**
     * The speed of the default transition
     * @default 0
     */
    transitionSpeed: number;
    /**
     * The speed of the default message
     * @default 0
     */
    messageSpeed: number;
    /**
     * The translation object
     * @default null
     */
    translation: unknown | null;
    /**
     * The default language
     * @default "en"
     */
    defaultLanguage: string;
    /**
     * The sides of the screen
     * @default ["left", "right"]
     */
    sides: string[];
    /**
     * The number of positions
     * @default { left: 1, right: 1 }
     */
    positions: {
        [key: string]: number;
    } | string[];
    /**
     * If the base styles should be imported
     * @default true
     */
    importBaseStyles: boolean;
    /**
     * The characters used for thinking
     */
    thinkCharacters: [string, string] | {
        prefix?: string;
        suffix?: string;
    };
}
