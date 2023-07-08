const keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null
    },

    properties: {
        valus: ""
    },



    init() {
        // メイン要素を作成する
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // 要素の中身をセットする
        this.elements.main.classList.add("keyboard");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // HTMLに上記で作成した要素を加える
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // 
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            this.open(element.value, currentValue => {
                element.value = currentValue;
            });

        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            " ド ", " ド# ", " レ ", " レ# ", " ミ ", " ファ ", " ファ# ", " ソ ", " ソ# ", " ラ ", " ラ# ", " シ ",
            ".ド ", ".ド# ", ".レ ", ".レ# ", ".ミ ", ".ファ ", ".ファ# ", ".ソ ", ".ソ# ", ".ラ ", ".ラ# ", ".シ ",
            ":ド ", ":ド# ", ":レ ", ":レ# ", ":ミ ", ":ファ ", ":ファ# ", ":ソ ", ":ソ# ", ":ラ ", ":ラ# ", ":シ ", "^ド "
        ];

        const keyHz = [
            261.626, 277.183, 293.665, 311.127, 329.628, 349.228, 369.994, 391.995, 415.305, 440.000, 466.164, 493.883,
            523.251, 554.365, 587.330, 622.254, 659.255, 698.456, 739.989, 783.991, 830.609, 880.000, 932.328, 987.767,
            1046.502, 1108.731, 1174.659, 1244.508, 1318.510, 1396.913, 1479.978, 1567.982, 1661.219, 1760.000, 1864.655, 1975.533, 2093.005
        ];

        keyLayout.forEach(key => {
            const index = keyLayout.indexOf(key)

            const keyElement = document.createElement("a");

            // 上で作成したボタンタグに、下記の形になるよう属性を付与する
            keyElement.classList.add("btn");

            // 黒鍵か白鍵かの分岐
            if (key.charAt(key.length - 2) == "#") {
                keyElement.classList.add("btn-dark", "keyboard__key--black");

                // キー押下時の挙動
                keyElement.addEventListener("click", () => {
                    this.properties.value += key.toString()
                    this._triggerEvent("oninput");
                    this.playSound(keyHz[index]);
                })
            } else {
                keyElement.classList.add("btn-light", "keyboard__key--white");

                // キー押下時の挙動
                keyElement.addEventListener("click", () => {
                    this.properties.value += key.toString()
                    this._triggerEvent("oninput");
                    this.playSound(keyHz[index]);
                })
            }
            fragment.appendChild(keyElement);
        });

        return fragment;
    },

    _triggerEvent(HandlerName) {
        if (typeof this.eventHandlers[HandlerName] == "function") {
            this.eventHandlers[HandlerName](this.properties.value);
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
    },

    playSound(sound) {

        var audioCtx = null
        var oscillator = null
        var gainNode = null
        var vol = 5;
        var soundLength = 0.5;

        if (audioCtx == null) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (gainNode == null) {
            gainNode = audioCtx.createGain();
            gainNode.gain.value = vol / 100;
        }
        if (oscillator == null) {
            oscillator = audioCtx.createOscillator();
            oscillator.type = 'triangle';
            let hz = sound;
            oscillator.frequency.setValueAtTime(hz, audioCtx.currentTime);
            oscillator.connect(gainNode).connect(audioCtx.destination);
            oscillator.start();
            oscillator.stop( audioCtx.currentTime + soundLength );
        }

    }


}

// 最初に読み込まれたときの処理
window.addEventListener("DOMContentLoaded", function () {
    keyboard.init();
});