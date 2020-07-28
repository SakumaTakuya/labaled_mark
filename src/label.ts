export interface Labeler {
    label(text : string, label: Label) : { text:string; caption:string; index:string; };
    reference(text : string) : string;
}

interface Reference {
    [label : string]: string;
}

interface Label {
    next() : string;
}

export class NumericalLabel implements Label {
    private id : number = 0;
    next(): string {
        this.id++;
        return this.id.toString();
    }
}

export class ArrayLabel implements Label {
    private arrayId : Array<number>;
    private currentLevel :number;
    private arrayLength : number;

    constructor(level : number) {
        this.arrayId = new Array<number>(level);
        this.currentLevel = 0;
        this.arrayLength = level;
    }

    set level(value : number) {
        this.currentLevel = value;
    }

    next(): string {
        if (this.currentLevel > 1) {
            this.arrayId[this.currentLevel-1]++;
        }

        for (let i = this.currentLevel; i < this.arrayLength; i++) {
          this.arrayId[i] = 0;
        }

        return this.arrayId.slice(1, this.currentLevel).join(".");
    }
}

export class LatexLabeler implements Labeler {
    private refDict : Reference = {};
    private labelExp : RegExp;
    private refExp : RegExp;

    constructor(labelExp : RegExp, refExp : RegExp) {
        this.labelExp = labelExp;
        this.refExp = refExp;
    }

    label(text: string, label: Label): { text: string; caption: string; index:string; } {
        const arr = text.split(this.labelExp);

        let desc = arr.splice(1,1)[0];
        let capt = "";
        if (desc != null) {
          [desc, capt] = desc.split(",");
        }
        const index = label.next()
        this.refDict[desc] = index;
      
        return { text:arr.join(""), caption:capt, index:index };
    }

    reference(text: string): string {
        return text.replace(
            this.refExp, 
            (_, p1, __, ___) => this.refDict[p1]);
    }

}