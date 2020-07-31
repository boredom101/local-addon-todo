interface ChangeArg {
    component?: string,
    newOne: string
}

export interface Result {
    question: boolean,
    type: string,
    arg: null | ChangeArg,
    valid: boolean,
    markdown: string
}

function searchFor(words: string[], keys: string[]): string {
    var inter = words.filter(value => keys.includes(value));
    if (inter.length == 0) {
        return "_unknown";
    }
    return inter[0];
}

export default function parse(text: string): Result {
    var isValid = true;
    var words: string[] = [];
    var lower = text.toLowerCase();
    var item = searchFor(lower.split(" "), ["rename", "inspect", "change"]);
    if (item == "_unknown") {
        isValid = false;
    }
    var argument : null | ChangeArg;
    if (item == "rename") {
        var start = text.indexOf("'");
        var name = text.substring(start+1, text.indexOf("'", start+1)-1);
        if (name.length == 0) {
            isValid = false
        }
        argument = {"newOne": name};
    } else if (item == "change") {
        var comp = searchFor(lower.split(" "), ["php", "sql"]);
        var newOne = lower.match(/[0-9]+\.[0-9]+\.[0-9]+/)[0];
        if (comp == "_unknown" || newOne.length == 0) {
            isValid = false;
        }
        argument = {
            "component": comp,
            "newOne": newOne
        }
    } else {
        argument = null;
    }
    if (item != "_unknown") {
        words.push(item);
    }
    if (argument) {
        words.push(newOne);
        if (comp) {
            words.push(comp);
        }
    }
    for (var word of words) {
        text = text.replace(word, "`" + word + "`");
    }
    return {
        question: lower.substring(lower.length - 1) == "?",
        type: item,
        arg: argument,
        valid: isValid,
        markdown: text
    };
}