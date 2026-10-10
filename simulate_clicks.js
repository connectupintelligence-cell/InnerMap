const fs = require("fs");
const jsCode = fs.readFileSync("app.js", "utf8");
const htmlCode = fs.readFileSync("index.html", "utf8");

// Mock window and document environment
const elements = {};
function createMockElement(id, tagName = "div") {
    return {
        id: id,
        tagName: tagName.toUpperCase(),
        style: {},
        classList: {
            add: () => {},
            remove: () => {},
            contains: () => false,
            toggle: () => {}
        },
        value: "Fiquei chateado na reunião de ontem e senti raiva e ansiedade.",
        textContent: "",
        innerHTML: "",
        innerText: "",
        dataset: { mode: "1", value: "teste" },
        getAttribute: (attr) => "teste",
        setAttribute: () => {},
        removeAttribute: () => {},
        addEventListener: (event, handler) => {
            console.log(`Bound listener '${event}' on #${id}`);
        },
        querySelector: () => createMockElement("sub-el"),
        querySelectorAll: () => [createMockElement("sub-el")],
        focus: () => {},
        scrollIntoView: () => {}
    };
}

global.window = global;
global.document = {
    readyState: "complete",
    addEventListener: (ev, fn) => {},
    getElementById: (id) => {
        if (!elements[id]) elements[id] = createMockElement(id);
        return elements[id];
    },
    querySelectorAll: (sel) => [createMockElement("mock-item")],
    querySelector: (sel) => createMockElement("mock-item"),
    createElement: (tag) => createMockElement("created-" + tag, tag),
    body: createMockElement("body", "body")
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
};
global.sessionStorage = global.localStorage;
global.location = { href: "", origin: "http://localhost", pathname: "/" };
global.atob = (str) => Buffer.from(str, 'base64').toString('binary');
global.alert = (msg) => console.log("[ALERT]:", msg);
global.prompt = (msg) => null;
global.confirm = () => true;

// Evaluate app.js
try {
    eval(jsCode);
    console.log("Successfully evaluated app.js!");
} catch(e) {
    console.error("Evaluation Error:", e);
}

// Test global window functions
const funcsToTest = [
    () => window.selectObjectiveMode(1),
    () => window.selectObjectiveMode(2),
    () => window.selectObjectiveMode(3),
    () => window.selectObjectiveMode(4),
    () => window.selectQuickTopic(createMockElement("chip")),
    () => window.handleAiAnalysis(),
    () => window.handleAiSkip(),
    () => window.handleToStep3(),
    () => window.handleToStep4(),
    () => window.handleFinish()
];

funcsToTest.forEach((fn, idx) => {
    try {
        console.log(`Testing function #${idx + 1}...`);
        fn();
        console.log(`Function #${idx + 1} executed CLEANLY!`);
    } catch(err) {
        console.error(`ERROR in Function #${idx + 1}:`, err);
    }
});
