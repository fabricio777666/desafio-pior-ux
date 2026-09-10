/* =====================================================
   ESTADO
===================================================== */

const state = {

    step1Easy: false,
    step2Easy: false,
    step3Easy: false,
    step4Easy: false,
    step5Easy: false,

    timerRunning: false,
    timerStart: 0

};


const $ = id =>
    document.getElementById(id);


/* =====================================================
   UTILITÁRIOS
===================================================== */

function shuffle(array) {

    const copy =
        [...array];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            copy[i],
            copy[j]
        ] =
        [
            copy[j],
            copy[i]
        ];
    }

    return copy;
}


function toast(message) {

    const element =
        $("toast");

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.classList.add(
        "show"
    );

    clearTimeout(
        toast.timer
    );

    toast.timer =
        setTimeout(
            () => {
                element.classList.remove(
                    "show"
                );
            },
            2500
        );
}


function goToStep(number) {

    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        $(
            "step" + i
        )?.classList.add(
            "hidden"
        );
    }


    $("success")?.classList.add(
        "hidden"
    );


    $("step" + number)
        ?.classList.remove(
            "hidden"
        );


    if ($("progressText")) {

        $("progressText")
            .textContent =
            `Etapa ${number} de 5`;
    }


    if ($("progressBar")) {

        $("progressBar")
            .style.width =
            `${number * 20}%`;
    }


    window.scrollTo({

        top: 0,

        behavior:
            "smooth"

    });

}


/* =====================================================
   ETAPA 1 — RELÓGIO
===================================================== */

$("terms")?.addEventListener(
    "change",
    () => {

        if (
            !$("terms").checked
        ) {
            return;
        }

        if (
            !state.step1Easy
        ) {

            $("clockGame")
                ?.classList
                .remove(
                    "hidden"
                );

            $("terms")
                .checked =
                false;
        }

    }
);


$("startTimer")?.addEventListener(
    "click",
    () => {

        if (
            state.timerRunning
        ) {
            return;
        }

        state.timerRunning =
            true;

        state.timerStart =
            performance.now();


        $("timerStatus")
            .textContent =
            "Cronômetro iniciado.";


        updateTimer();

    }
);


function updateTimer() {

    if (
        !state.timerRunning
    ) {
        return;
    }


    const elapsed =
        (
            performance.now() -
            state.timerStart
        ) / 1000;


    $("timerDisplay")
        .textContent =
        elapsed.toFixed(
            2
        );


    requestAnimationFrame(
        updateTimer
    );
}


$("stopTimer")?.addEventListener(
    "click",
    () => {

        if (
            !state.timerRunning
        ) {
            return;
        }


        state.timerRunning =
            false;


        const elapsed =
            (
                performance.now() -
                state.timerStart
            ) / 1000;


        $("timerDisplay")
            .textContent =
            elapsed.toFixed(
                2
            );


        if (
            Math.abs(
                elapsed - 3
            ) <= 0.12
        ) {

            $("timerStatus")
                .textContent =
                "Verificação aceita.";


            $("terms")
                .checked =
                true;


            $("clockGame")
                ?.classList
                .add(
                    "hidden"
                );


            toast(
                "Precisão suficiente."
            );

        } else {

            $("timerStatus")
                .textContent =
                "Incorreto. O objetivo era 3,00 segundos.";


            toast(
                "Você parou no momento errado."
            );
        }

    }
);


$("continue1")?.addEventListener(
    "click",
    () => {

        if (
            !$("name")
                .value
                .trim()
        ) {

            toast(
                "Informe seu nome."
            );

            return;
        }


        if (
            !$("email")
                .value
                .includes("@")
        ) {

            toast(
                "Informe um e-mail válido."
            );

            return;
        }


        const age =
            Number(
                $("age").value
            );


        if (
            !Number.isFinite(age) ||
            age < 1 ||
            age > 150
        ) {

            toast(
                "Informe uma idade válida."
            );

            return;
        }


        if (
            !$("terms")
                .checked
        ) {

            toast(
                "Confirme os termos."
            );

            return;
        }


        resetMainFlow();

        goToStep(2);

    }
);


/* =====================================================
   REQUISITOS DE SENHA
===================================================== */

const mainRequirements = [

    {
        text:
            "A senha precisa ter entre 10 e 16 caracteres.",

        test:
            value =>
                value.length >= 10 &&
                value.length <= 16
    },


    {
        text:
            "Coloque pelo menos uma letra maiúscula.",

        test:
            value =>
                /[A-Z]/.test(value)
    },


    {
        text:
            "Agora coloque pelo menos duas letras minúsculas.",

        test:
            value =>
                (
                    value.match(
                        /[a-z]/g
                    ) || []
                ).length >= 2
    },


    {
        text:
            "Precisamos de pelo menos dois números.",

        test:
            value =>
                (
                    value.match(
                        /[0-9]/g
                    ) || []
                ).length >= 2
    },


    {
        text:
            "Adicione pelo menos um caractere especial.",

        test:
            value =>
                /[^A-Za-z0-9]/.test(value)
    },


    {
        text:
            "A senha deve começar com uma letra.",

        test:
            value =>
                /^[A-Za-z]/.test(value)
    },


    {
        text:
            "A senha deve terminar exatamente com um número.",

        test:
            value =>
                /\d$/.test(value)
    },


    {
        text:
            "A senha precisa conter a letra R ou r.",

        test:
            value =>
                /r/i.test(value)
    },


    {
        text:
            "Não pode existir nenhum espaço.",

        test:
            value =>
                !/\s/.test(value)
    },


    {
        text:
            "Não pode haver três caracteres iguais seguidos.",

        test:
            value =>
                !/(.)\1\1/.test(value)
    },


    {
        text:
            "Evite sequências como 123, 234, abc, bcd ou xyz.",

        test:
            value =>
                !/123|234|345|456|abc|bcd|cde|xyz/i.test(value)
    },


    {
        text:
            "Os dois primeiros números encontrados precisam ser diferentes.",

        test:
            value => {

                const digits =
                    value.match(
                        /[0-9]/g
                    ) || [];

                return (
                    digits.length >= 2 &&
                    digits[0] !== digits[1]
                );

            }
    }

];


const secondaryRequirements = [

    {
        text:
            "Use entre 8 e 14 caracteres.",

        test:
            value =>
                value.length >= 8 &&
                value.length <= 14
    },


    {
        text:
            "Inclua pelo menos uma letra maiúscula.",

        test:
            value =>
                /[A-Z]/.test(value)
    },


    {
        text:
            "Agora são necessárias três letras minúsculas.",

        test:
            value =>
                (
                    value.match(
                        /[a-z]/g
                    ) || []
                ).length >= 3
    },


    {
        text:
            "Coloque pelo menos dois números.",

        test:
            value =>
                (
                    value.match(
                        /[0-9]/g
                    ) || []
                ).length >= 2
    },


    {
        text:
            "Também é necessário um caractere especial.",

        test:
            value =>
                /[^A-Za-z0-9]/.test(value)
    },


    {
        text:
            "A segunda senha deve começar com uma letra.",

        test:
            value =>
                /^[A-Za-z]/.test(value)
    },


    {
        text:
            "Ela deve terminar com uma letra ou número.",

        test:
            value =>
                /[A-Za-z0-9]$/.test(value)
    },


    {
        text:
            "Agora inclua X ou x.",

        test:
            value =>
                /x/i.test(value)
    },


    {
        text:
            "Espaços continuam proibidos.",

        test:
            value =>
                !/\s/.test(value)
    },


    {
        text:
            "Ela não pode ser igual à senha principal.",

        test:
            value =>
                value !==
                (
                    $("password")
                        ?.value || ""
                )
    },


    {
        text:
            "Não use três caracteres iguais seguidos.",

        test:
            value =>
                !/(.)\1\1/.test(value)
    },


    {
        text:
            "O total de caracteres precisa ser ímpar.",

        test:
            value =>
                value.length % 2 === 1
    }

];


const passwordFlow = {

    main: {

        list: [],

        index: 0,

        advancing: false

    },

    secondary: {

        list: [],

        index: 0,

        advancing: false

    }

};


function preparePasswordFlow(
    type
) {

    const source =
        type === "main"
            ? mainRequirements
            : secondaryRequirements;


    passwordFlow[type]
        .list =
        shuffle(source);


    passwordFlow[type]
        .index =
        0;


    passwordFlow[type]
        .advancing =
        false;
}


function renderCurrentRequirement(
    type
) {

    const flow =
        passwordFlow[type];


    const container =
        type === "main"
            ? $("requirements")
            : $("secondaryRequirements");


    const status =
        type === "main"
            ? $("passwordStatus")
            : $("secondaryStatus");


    if (!container) {
        return;
    }


    const current =
        flow.list[
            flow.index
        ];


    if (!current) {

        container.innerHTML = `
            <div class="requirement complete">
                <span class="symbol">✓</span>
                <span>
                    Todos os requisitos foram concluídos.
                </span>
            </div>
        `;


        container.style.transform =
            "rotate(0deg)";


        if (status) {

            status.textContent =
                "Todos os requisitos concluídos.";
        }


        return;
    }


    container.innerHTML = `
        <div class="requirement current">
            <span class="symbol">?</span>
            <span>${current.text}</span>
        </div>
    `;


    const rotation =
        Math.random() * 1.4 - 0.7;


    const horizontal =
        Math.random() * 4 - 2;


    container.style.transform =
        `
        translateX(
            ${horizontal.toFixed(1)}px
        )
        rotate(
            ${rotation.toFixed(2)}deg
        )
        `;


    if (status) {

        status.textContent =
            `Regra ${
                flow.index + 1
            } de ${
                flow.list.length
            }.`;
    }

}


function resetMainFlow() {

    preparePasswordFlow(
        "main"
    );


    $("password").value =
        "";


    $("confirmPassword").value =
        "";


    renderCurrentRequirement(
        "main"
    );
}


function resetSecondaryFlow() {

    preparePasswordFlow(
        "secondary"
    );


    $("secondaryPassword")
        .value =
        "";


    $("confirmSecondary")
        .value =
        "";


    renderCurrentRequirement(
        "secondary"
    );
}


function tryAdvancePassword(
    type,
    value
) {

    const flow =
        passwordFlow[type];


    const current =
        flow.list[
            flow.index
        ];


    if (
        !current ||
        flow.advancing
    ) {
        return;
    }


    if (
        !current.test(value)
    ) {
        return;
    }


    flow.advancing =
        true;


    const container =
        type === "main"
            ? $("requirements")
            : $("secondaryRequirements");


    const element =
        container
            ?.querySelector(
                ".requirement"
            );


    if (element) {

        element.classList.add(
            "complete"
        );


        const symbol =
            element.querySelector(
                ".symbol"
            );


        if (symbol) {

            symbol.textContent =
                "✓";
        }
    }


    setTimeout(
        () => {

            flow.index++;

            flow.advancing =
                false;

            renderCurrentRequirement(
                type
            );

        },
        220
    );

}


/* =====================================================
   SENHA PRINCIPAL
===================================================== */

$("password")?.addEventListener(
    "input",
    () => {

        if (
            state.step2Easy
        ) {
            return;
        }


        tryAdvancePassword(
            "main",
            $("password").value
        );

    }
);


$("continue2")?.addEventListener(
    "click",
    () => {

        const password =
            $("password").value;


        const confirmation =
            $("confirmPassword").value;


        if (
            !state.step2Easy
        ) {

            if (
                passwordFlow.main.index <
                passwordFlow.main.list.length
            ) {

                toast(
                    "Ainda existe uma regra pendente."
                );

                return;
            }
        }


        if (
            password !== confirmation
        ) {

            toast(
                "As senhas não coincidem."
            );

            return;
        }


        resetSecondaryFlow();

        goToStep(3);

    }
);


/* =====================================================
   SENHA SECUNDÁRIA
===================================================== */

$("secondaryPassword")
    ?.addEventListener(
        "input",
        () => {

            if (
                state.step3Easy
            ) {
                return;
            }


            tryAdvancePassword(
                "secondary",
                $("secondaryPassword")
                    .value
            );

        }
    );


$("continue3")
    ?.addEventListener(
        "click",
        () => {

            const password =
                $("secondaryPassword")
                    .value;


            const confirmation =
                $("confirmSecondary")
                    .value;


            if (
                !state.step3Easy
            ) {

                if (
                    passwordFlow.secondary.index <
                    passwordFlow.secondary.list.length
                ) {

                    toast(
                        "Ainda existe uma regra pendente."
                    );

                    return;
                }
            }


            if (
                password !== confirmation
            ) {

                toast(
                    "As senhas não coincidem."
                );

                return;
            }


            generateCaptcha();

            goToStep(4);

        }
    );


/* =====================================================
   CAPTCHA
===================================================== */

const captchaState = {

    index: 0,

    current: null,

    selected: []

};


const captchaGenerators = [

    generateGridCaptcha,

    generateMatrixCaptcha,

    generateSequenceCaptcha,

    generateChecksumCaptcha,

    generateConfusingCaptcha,

    generateLogicCaptcha,

    generateSortingCaptcha,

    generateCountPatternCaptcha,

    generateExtractionCaptcha,

    generateFinalMixedCaptcha

];


function setCaptcha(
    puzzle
) {

    captchaState.current =
        puzzle;


    $("captchaTitle")
        .textContent =
        `
        Verificação ${
            captchaState.index + 1
        } de 10
        `;


    $("captchaInstruction")
        .textContent =
        puzzle.instruction;


    $("captchaPuzzle")
        .innerHTML =
        puzzle.html;


    $("captchaAnswer")
        .value = "";

}


function generateCaptcha() {

    captchaState.index =
        0;


    captchaState.selected =
        shuffle(
            captchaGenerators
        );


    setCaptcha(
        captchaState
            .selected[0]()
    );

}


/* =====================================================
   CAPTCHA 1 — MATRIZ DE CARACTERES
===================================================== */

function generateGridCaptcha() {

    const rows = 7;

    const cols = 9;

    const symbols = [

        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "7",
        "8"

    ];


    const differentRow =
        Math.floor(
            Math.random() *
            rows
        );


    const specialPosition =
        Math.floor(
            Math.random() *
            cols
        );


    const base =
        symbols[
            Math.floor(
                Math.random() *
                symbols.length
            )
        ];


    let html = "";


    for (
        let row = 0;
        row < rows;
        row++
    ) {

        const line = [];


        for (
            let col = 0;
            col < cols;
            col++
        ) {

            let char;


            if (
                row === differentRow
            ) {

                char =
                    base;

            } else {

                char =
                    symbols[
                        Math.floor(
                            Math.random() *
                            symbols.length
                        )
                    ];
            }


            line.push(
                char
            );

        }


        if (
            row === differentRow
        ) {

            let replacement;


            do {

                replacement =
                    symbols[
                        Math.floor(
                            Math.random() *
                            symbols.length
                        )
                    ];

            } while (
                replacement === base
            );


            line[specialPosition] =
                replacement;
        }


        html += `
            <div class="puzzle-row">
                ${row + 1}.
                ${line.join(" ")}
            </div>
        `;
    }


    return {

        instruction:
            "Uma linha possui exatamente um caractere diferente. Qual linha é?",

        html,

        answer:
            String(
                differentRow + 1
            )

    };

}


/* =====================================================
   CAPTCHA 2 — MATRIZ / COORDENADA
===================================================== */

function generateMatrixCaptcha() {

    const rows = 6;

    const cols = 8;

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


    const targetRow =
        Math.floor(
            Math.random() *
            rows
        );


    const targetCol =
        Math.floor(
            Math.random() *
            cols
        );


    const matrix = [];


    for (
        let r = 0;
        r < rows;
        r++
    ) {

        matrix[r] = [];


        for (
            let c = 0;
            c < cols;
            c++
        ) {

            matrix[r][c] =
                chars[
                    Math.floor(
                        Math.random() *
                        chars.length
                    )
                ];

        }

    }


    const target =
        matrix[
            targetRow
        ][
            targetCol
        ];


    let html = `
        <div class="matrix-header">
            <span></span>

            ${
                Array.from(
                    {
                        length: cols
                    },
                    (_, i) =>
                        `<span>${i + 1}</span>`
                ).join("")
            }

        </div>
    `;


    matrix.forEach(
        (row, index) => {

            html += `
                <div class="matrix-row">

                    <b>
                        ${index + 1}
                    </b>

                    ${
                        row
                            .map(
                                char =>
                                    `<span>${char}</span>`
                            )
                            .join("")
                    }

                </div>
            `;

        }
    );


    return {

        instruction:
            `
            Qual caractere está na
            linha ${targetRow + 1},
            coluna ${targetCol + 1}?
            `,

        html,

        answer:
            target

    };

}


/* =====================================================
   CAPTCHA 3 — SEQUÊNCIA
===================================================== */

function generateSequenceCaptcha() {

    const plus =
        Math.floor(
            Math.random() * 4
        ) + 2;


    const multiply =
        Math.floor(
            Math.random() * 3
        ) + 2;


    const start =
        Math.floor(
            Math.random() * 5
        ) + 1;


    const values = [
        start
    ];


    values.push(
        values[0] + plus
    );


    values.push(
        values[1] * multiply
    );


    values.push(
        values[2] - plus
    );


    values.push(
        values[3] + multiply
    );


    values.push(
        values[4] * plus
    );


    return {

        instruction:
            `
            Descubra o próximo valor.
            A regra é:
            +${plus},
            ×${multiply},
            −${plus},
            +${multiply},
            ×${plus}.
            `,

        html:
            `
            <div class="captcha-large">
                ${
                    values
                        .slice(
                            0,
                            5
                        )
                        .join(" → ")
                }
                → ?
            </div>
            `,

        answer:
            String(
                values[5]
            )

    };

}


/* =====================================================
   CAPTCHA 4 — CHECKSUM
===================================================== */

function generateChecksumCaptcha() {

    const chars = [];

    const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    for (
        let i = 0;
        i < 8;
        i++
    ) {

        if (
            Math.random() < 0.55
        ) {

            chars.push(
                String(
                    Math.floor(
                        Math.random() *
                        10
                    )
                )
            );

        } else {

            chars.push(
                alphabet[
                    Math.floor(
                        Math.random() *
                        alphabet.length
                    )
                ]
            );

        }

    }


    let sum = 0;


    for (
        const char of chars
    ) {

        if (
            /\d/.test(char)
        ) {

            sum +=
                Number(char);

        } else {

            sum +=
                char.charCodeAt(
                    0
                ) - 64;

        }

    }


    return {

        instruction:
            `
            Some os valores.
            Números valem o próprio valor.
            A=1, B=2 ... Z=26.
            Digite somente o último
            dígito do total.
            `,

        html:
            `
            <div class="captcha-large">
                ${chars.join("  ")}
            </div>
            `,

        answer:
            String(
                sum % 10
            )

    };

}


/* =====================================================
   CAPTCHA 5 — PARES PARECIDOS
===================================================== */

function generateConfusingCaptcha() {

    const pool = [

        ["O0", "O0"],
        ["B8", "B8"],
        ["Il", "Il"],
        ["1I", "1I"],
        ["S5", "S5"],
        ["Z2", "Z2"],
        ["G6", "G6"]

    ];


    const lines =
        shuffle(pool)
            .slice(
                0,
                6
            )
            .map(
                pair => [...pair]
            );


    const differentLine =
        Math.floor(
            Math.random() *
            lines.length
        );


    const alternatives = [

        ["O0", "0O"],
        ["B8", "8B"],
        ["Il", "lI"],
        ["1I", "I1"],
        ["S5", "5S"],
        ["Z2", "2Z"],
        ["G6", "6G"]

    ];


    lines[
        differentLine
    ] =
        alternatives[
            Math.floor(
                Math.random() *
                alternatives.length
            )
        ];


    return {

        instruction:
            `
            Qual linha contém
            os dois grupos diferentes?
            `,

        html:
            lines
                .map(
                    (line, index) => `
                        <div class="puzzle-row">
                            ${index + 1}.
                            ${line[0]}
                            &nbsp;&nbsp;&nbsp;
                            ${line[1]}
                        </div>
                    `
                )
                .join(""),

        answer:
            String(
                differentLine + 1
            )

    };

}


/* =====================================================
   CAPTCHA 6 — LÓGICA
===================================================== */

function generateLogicCaptcha() {

    const a =
        Math.floor(
            Math.random() * 8
        ) + 2;


    const b =
        Math.floor(
            Math.random() * 7
        ) + 2;


    const c =
        Math.floor(
            Math.random() * 6
        ) + 1;


    const first =
        a + b;


    const second =
        first * c;


    const answer =
        second - a;


    return {

        instruction:
            "Siga as operações e descubra o resultado final.",

        html:
            `
            <div class="logic-puzzle">

                A + B =
                ${first}

                <br>

                (${a} + ${b}) × ${c}
                =
                ${second}

                <br>

                ${second}
                −
                ${a}
                =
                ?

            </div>
            `,

        answer:
            String(answer)

    };

}


/* =====================================================
   CAPTCHA 7 — ORDENAÇÃO
===================================================== */

function generateSortingCaptcha() {

    const numbers = [];


    while (
        numbers.length < 7
    ) {

        const value =
            Math.floor(
                Math.random() * 90
            ) + 10;


        if (
            !numbers.includes(
                value
            )
        ) {

            numbers.push(
                value
            );

        }

    }


    const sorted =
        [...numbers]
            .sort(
                (a, b) =>
                    a - b
            );


    return {

        instruction:
            `
            Coloque os números
            mentalmente em ordem crescente.
            Qual é o quarto?
            `,

        html:
            `
            <div class="captcha-large">
                ${numbers.join(" · ")}
            </div>
            `,

        answer:
            String(
                sorted[3]
            )

    };

}


/* =====================================================
   CAPTCHA 8 — CONTAGEM
===================================================== */

function generateCountPatternCaptcha() {

    const alphabet =
        "ABCDEFGHJKLMNPQRSTUVWXYZ";


    const target =
        alphabet[
            Math.floor(
                Math.random() *
                alphabet.length
            )
        ];


    const values = [];

    let count = 0;


    for (
        let i = 0;
        i < 60;
        i++
    ) {

        if (
            Math.random() < 0.18
        ) {

            values.push(
                target
            );

            count++;

        } else {

            let char;


            do {

                char =
                    alphabet[
                        Math.floor(
                            Math.random() *
                            alphabet.length
                        )
                    ];

            } while (
                char === target
            );


            values.push(
                char
            );

        }

    }


    return {

        instruction:
            `
            Conte quantas vezes
            a letra "${target}"
            aparece.
            `,

        html:
            `
            <div class="captcha-no-break">
                ${values.join(" ")}
            </div>
            `,

        answer:
            String(count)

    };

}


/* =====================================================
   CAPTCHA 9 — EXTRAÇÃO
===================================================== */

function generateExtractionCaptcha() {

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


    const sequence =
        Array.from(
            {
                length: 12
            },
            () =>
                chars[
                    Math.floor(
                        Math.random() *
                        chars.length
                    )
                ]
        );


    const a =
        Math.floor(
            Math.random() * 3
        ) + 2;


    const b =
        Math.floor(
            Math.random() * 4
        ) + 2;


    const position =
        (
            (a * b - 1) %
            sequence.length
        ) + 1;


    return {

        instruction:
            `
            Calcule ${a} × ${b}.
            Use o resultado como posição.
            Qual caractere está nessa posição?
            `,

        html:
            `
            <div class="captcha-large">
                ${sequence.join(" ")}
            </div>
            `,

        answer:
            sequence[
                position - 1
            ]

    };

}


/* =====================================================
   CAPTCHA 10 — MISTO
===================================================== */

function generateFinalMixedCaptcha() {

    const numbers = [];


    const letters =
        shuffle([
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G"
        ]);


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        numbers.push(
            Math.floor(
                Math.random() * 9
            ) + 1
        );

    }


    const largest =
        Math.max(
            ...numbers
        );


    const position =
        numbers.indexOf(
            largest
        );


    const answer =
        `${largest}${letters[position]}`;


    return {

        instruction:
            `
            Encontre o maior número.
            Digite esse número seguido
            da letra que está na mesma posição.
            `,

        html:
            `
            <div class="mixed-puzzle">

                Letras:
                <br>

                ${letters.join("   ")}

                <br><br>

                Números:
                <br>

                ${numbers.join("   ")}

            </div>
            `,

        answer

    };

}


/* =====================================================
   VALIDAR CAPTCHA
===================================================== */

$("captchaButton")
    ?.addEventListener(
        "click",
        () => {

            if (
                state.step4Easy
            ) {

                prepareFinalStage();

                goToStep(5);

                return;
            }


            const typed =
                (
                    $("captchaAnswer")
                        ?.value ||
                    ""
                )
                    .trim()
                    .toUpperCase();


            const expected =
                String(
                    captchaState
                        .current
                        .answer
                )
                    .trim()
                    .toUpperCase();


            if (
                typed !==
                expected
            ) {

                toast(
                    "Resposta incorreta. Novo desafio gerado."
                );


                const generator =
                    captchaState
                        .selected[
                            captchaState.index
                        ];


                setCaptcha(
                    generator()
                );


                return;
            }


            captchaState.index++;


            if (
                captchaState.index >= 10
            ) {

                prepareFinalStage();

                goToStep(5);

                return;
            }


            const nextGenerator =
                captchaState
                    .selected[
                        captchaState.index
                    ];


            setCaptcha(
                nextGenerator()
            );

        }
    );


/* =====================================================
   ETAPA 5 — BOTÃO FINAL
===================================================== */

let finishAnimationFrame =
    null;


let finishX = 0;

let finishY = 0;

let finishVX = 10;

let finishVY = 9;


function prepareFinalStage() {

    const area =
        $("finishArea");


    const button =
        $("finish");


    if (
        !area ||
        !button
    ) {

        return;
    }


    button.textContent =
        "botão";


    if (
        finishAnimationFrame
    ) {

        cancelAnimationFrame(
            finishAnimationFrame
        );
    }


    finishX =
        Math.random() *
        Math.max(
            1,
            area.clientWidth -
            button.offsetWidth
        );


    finishY =
        Math.random() *
        Math.max(
            1,
            area.clientHeight -
            button.offsetHeight
        );


    finishVX =
        (
            Math.random() > 0.5
                ? 1
                : -1
        ) *
        (
            8 +
            Math.random() * 5
        );


    finishVY =
        (
            Math.random() > 0.5
                ? 1
                : -1
        ) *
        (
            7 +
            Math.random() * 5
        );


    button.style.transform =
        `
        translate(
            ${finishX}px,
            ${finishY}px
        )
        `;


    moveFinishButton();

}


function moveFinishButton() {

    const area =
        $("finishArea");


    const button =
        $("finish");


    if (
        !area ||
        !button
    ) {

        return;
    }


    const maxX =
        Math.max(
            0,
            area.clientWidth -
            button.offsetWidth
        );


    const maxY =
        Math.max(
            0,
            area.clientHeight -
            button.offsetHeight
        );


    finishX +=
        finishVX;


    finishY +=
        finishVY;


    if (
        finishX <= 0 ||
        finishX >= maxX
    ) {

        finishVX *= -1;


        finishX =
            Math.max(
                0,
                Math.min(
                    maxX,
                    finishX
                )
            );
    }


    if (
        finishY <= 0 ||
        finishY >= maxY
    ) {

        finishVY *= -1;


        finishY =
            Math.max(
                0,
                Math.min(
                    maxY,
                    finishY
                )
            );
    }


    button.style.transform =
        `
        translate(
            ${finishX}px,
            ${finishY}px
        )
        `;


    finishAnimationFrame =
        requestAnimationFrame(
            moveFinishButton
        );

}


$("finish")
    ?.addEventListener(
        "click",
        () => {

            if (
                finishAnimationFrame
            ) {

                cancelAnimationFrame(
                    finishAnimationFrame
                );

                finishAnimationFrame =
                    null;
            }


            showSuccess();

        }
    );


function showSuccess() {

    if (
        finishAnimationFrame
    ) {

        cancelAnimationFrame(
            finishAnimationFrame
        );

        finishAnimationFrame =
            null;
    }


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        $("step" + i)
            ?.classList
            .add("hidden");

    }


    $("success")
        ?.classList
        .remove("hidden");


    if (
        $("progressText")
    ) {

        $("progressText")
            .textContent =
            "Concluído";
    }


    if (
        $("progressBar")
    ) {

        $("progressBar")
            .style.width =
            "100%";
    }

}


/* =====================================================
   BOTÕES SECRETOS
===================================================== */

$("secret1")
    ?.addEventListener(
        "click",
        () => {

            state.step1Easy =
                true;


            $("clockGame")
                ?.classList
                .add("hidden");


            $("terms")
                .checked =
                true;


            toast(
                "Etapa simplificada."
            );

        }
    );


$("secret2")
    ?.addEventListener(
        "click",
        () => {

            state.step2Easy =
                true;


            passwordFlow.main.index =
                passwordFlow.main.list.length;


            $("requirements")
                .innerHTML = `
                    <div class="requirement complete">
                        <span class="symbol">
                            ✓
                        </span>

                        <span>
                            Validação simplificada.
                        </span>
                    </div>
                `;


            $("requirements")
                .style.transform =
                "none";


            $("passwordStatus")
                .textContent =
                "Etapa liberada.";


            toast(
                "Senha principal simplificada."
            );

        }
    );


$("secret3")
    ?.addEventListener(
        "click",
        () => {

            state.step3Easy =
                true;


            passwordFlow.secondary.index =
                passwordFlow.secondary.list.length;


            $("secondaryRequirements")
                .innerHTML = `
                    <div class="requirement complete">
                        <span class="symbol">
                            ✓
                        </span>

                        <span>
                            Validação simplificada.
                        </span>
                    </div>
                `;


            $("secondaryRequirements")
                .style.transform =
                "none";


            $("secondaryStatus")
                .textContent =
                "Etapa liberada.";


            toast(
                "Senha secundária simplificada."
            );

        }
    );


$("secret4")
    ?.addEventListener(
        "click",
        () => {

            state.step4Easy =
                true;


            toast(
                "CAPTCHA simplificado."
            );

        }
    );


$("secret5")
    ?.addEventListener(
        "click",
        () => {

            state.step5Easy =
                true;


            $("finalStatus")
                .textContent =
                "Finalização simplificada.";


            toast(
                "Última etapa simplificada."
            );

        }
    );


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

preparePasswordFlow(
    "main"
);


preparePasswordFlow(
    "secondary"
);


renderCurrentRequirement(
    "main"
);


renderCurrentRequirement(
    "secondary"
);


document
    .querySelectorAll(
        "input"
    )
    .forEach(
        input => {

            input.setAttribute(
                "autocomplete",
                "off"
            );

        }
    );