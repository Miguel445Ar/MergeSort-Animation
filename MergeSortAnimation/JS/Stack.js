class ListNode {
    constructor(value){
        this._value = value;
        this._next = null;
        this._back = null;
    }
    get value(){
        return this._value;
    }
    get next(){
        return this._next;
    }
    get back(){
        return this._back;
    }
    set next(value){
        this._next = value;
    }
    set back(value){
        this._back = value;
    }
}

export class Stack {
    constructor(){
        this._head = null;
        this._top = null;
        this._size = 0;
    }
    get top(){
        return this._top.value;
    }
    get size(){
        return this._size;
    }
    push(value){
        const newNode = new ListNode(value);
        if(this._size == 0)
            this._head = this._top = newNode;
        else {
            this._top.next = newNode;
            newNode.back = this._top;
            this._top = newNode;
        }
        ++this._size;
    }
    print(){
        let aux = this._head;
        while(aux != null){
            console.log(aux.value);
            aux = aux.next;
        }
    }
    pop(){
        if(this._size == 0)
            return;
        if(this._size == 1){
            this._head = this._top = null;
        }else {
            this._top = this._top.back;
            this._top.next.back = null;
            this._top.next = null;
        }
        --this._size;

    }
}