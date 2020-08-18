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
    var comp = "";
    var isValid = true;
    var words: string[] = [];
    var lower = text.toLowerCase();
    var item = searchFor(lower.split(/[\.,\?! \t]/), ["rename", "inspect", "change"]);
    const validVersions = ['7.3.5', '7.4.1', '5.6.39'];
    if (item == "_unknown") {
        isValid = false;
    }
    var argument : null | ChangeArg;
    if (item == "rename") {
        var start = text.indexOf("'");
        var name = text.substring(start+1, text.indexOf("'", start+1));
        if (name.length === 0) {
            isValid = false
        }
        argument = {"newOne": name};
    } else if (item == "change") {
        comp = searchFor(lower.split(/[\.,\?! \t]/), ["php"]);
        var newOne = lower.match(/[0-9]+\.[0-9]+\.[0-9]+/);
        if (comp == "_unknown" || ! newOne || ! validVersions.includes(newOne[0])) {
            isValid = false;
        }
        if (isValid) {
            argument = {
                "component": comp,
                "newOne": newOne[0]
            }
        }
    } else {
        argument = null;
    }
    if (item != "_unknown") {
        words.push(item);
    }
    if (argument) {
        words.push(argument.newOne);
        if (argument.component) {
            words.push(argument.component);
        }
    }
    for (var word of words) {
        const regex = new RegExp(word, 'i');
        text = text.replace(regex, function matcher(match) { return '`' + match + '`'});
    }
    return {
        question: lower.substring(lower.length - 1) == "?",
        type: item,
        arg: argument,
        valid: isValid,
        markdown: text
    };
}