// Variables
import { Stack } from "./Stack.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const fps = 5;
const width = 60;
const height = 60;
let stop = false;

window.devicePixelRatio = 5;
const scale = window.devicePixelRatio;
canvas.width = Math.floor(canvas.width * scale);
canvas.height = Math.floor(canvas.height * scale);

function resolveAfter(x,y,width,height) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
        ctx.clearRect(x,y,width,height);
      }, fps);
    });
}

class Data {
    constructor(i,f,m,x,y){
        this._i = i;
        this._f = f;
        this._m = m;
        this._x = x;
        this._y = y;
    }
    get i(){
        return this._i;
    }
    get f(){
        return this._f;
    }
    get m(){
        return this._m;
    }
    get x(){
        return this._x;
    }
    get y(){
        return this._y;
    }
}

class IterativeMergeSort {
    constructor(size){
        this._arr = [];
        this._size = size;
        this._x = 200;
        this._y = 10;
        this._init = 0;
        this._end = this._size - 1;
        this._toRight = false;
        const start = new Data(0,this._size - 1, Math.floor((0 + this._size - 1)/2),this._x,this._y);
        this._parents = new Stack();
        this._parents.push(start);
        this._stack = [[start, 1]];
        for(let i = 0; i < this._size; ++i)
            this._arr.push(Math.round(1 + Math.random()*20));
    }
    async mergesort(){
        while(this._stack.length > 0){
            
            if(this._init < this._end && this._toRight === true){
                const middle = Math.floor((this._init + this._end)/2);
                const x = this._parents.top.x;
                const y = this._parents.top.y;
                const cant = (this._parents.top.m - this._parents.top.i) + 1;
                const newData = new Data(this._init,this._end,middle,(x+(cant*width))+(10*cant),y + height + 50);
                await this.LeftWayAnimation(this._init,this._end,(x+(cant*width))+(10*cant),y+height+50,newData);
                this._stack.push([newData,1]);
            }
            while(this._init < this._end){
                const middle = Math.floor((this._init + this._end)/2);
                const mid = Math.floor((this._init + middle)/2);
                const x = this._parents.top.x;
                const y = this._parents.top.y;
                const newData = new Data(this._init,middle,mid,x,y + height + 50);
                ctx.clearRect(0,0,canvas.width,canvas.height);
                this.draw();
                await this.LeftWayAnimation(this._init,middle,x,y+height+50,newData);
                this._stack.push([newData,1]);
                this._end = middle;
            }
            if(this._stack[this._stack.length - 1][1] === 2){
                if(this._stack[this._stack.length - 1][0].i < this._stack[this._stack.length - 1][0].f)
                    await this.merge(this._stack[this._stack.length - 1][0].i,this._stack[this._stack.length - 1][0].f,this._stack[this._stack.length - 1][0].m,this._stack[this._stack.length - 1][0].x,this._stack[this._stack.length - 1][0].y);
                const s = (this._stack[this._stack.length - 1][0].f - this._stack[this._stack.length - 1][0].i) + 1;
                this._parents.pop();
                if(this._parents.size >= 1)
                    await this.MergeUp(this._arr,this._stack[this._stack.length - 1][0].i,this._stack[this._stack.length - 1][0].f,s,this._stack[this._stack.length - 1][0].x,this._parents.top.y,this._stack[this._stack.length - 1][0].y,false);
                this._stack.pop();
                continue;
            }
            this._stack[this._stack.length - 1][1] = 2;
            this._init = this._stack[this._stack.length - 1][0].m + 1;
            this._end = this._stack[this._stack.length - 1][0].f;
            this._toRight = true;
            if(this._init === this._end){
                const x = this._parents.top.x;
                const y = this._parents.top.y;
                const cant = (this._parents.top.m - this._parents.top.i) + 1;
                await this.MergeDown(this._arr,this._init,this._end,cant,(x+(cant*width))+(10*cant),y + height + 50,y);
                await this.MergeUp(this._arr,this._init,this._end,cant,(x+(cant*width))+(10*cant),y,y + height + 50,true);
            }
            ctx.clearRect(0,0,canvas.width,canvas.height);
            if(this._stack.length > 0)
                this.draw();
        }
        return new Promise(resolve => {
            resolve('resolved');
        });
    }
    async LeftWayAnimation(init, end,x,y,data){
        let initY = this._parents.top.y;
        const cant = (end - init) + 1;
        while(true){
            if(initY == y){
                this._parents.push(data);
                let xi = x;
                for(let i = init; i <= end; ++i){
                    this.drawNumberRectangle(this._arr[i],xi,y,true);
                    xi += width;
                    xi += 10;
                }   
                break;
            }
            let xi = x;
            let yi = initY;
            this.drawSingle();
            for(let i = init; i <= end; ++i){
                this.drawNumberRectangle(this._arr[i],xi,yi,true);
                xi += width;
                xi += 10;
            }   
            ++initY;
            await resolveAfter(x,yi,(width*cant)+(10*cant),height);
        }
        //ctx.clearRect(0,0,canvas.width,canvas.height);
        //this.draw();
        return new Promise(resolve => {
            resolve('resolved');
        });
    }
    async merge(i,f,m,x,y){
        const s = (f - i ) + 1;
        let aux = new Array(s);
        await this.MergeDown(aux,0,s - 1,s,x,y + height + 50,y);
        let k = 0, l = i, r = m + 1;
        while(l <= m && r <= f){
            if(this._arr[l] < this._arr[r]){
                const cant1 = (l - i);
                const xi = x + (cant1 * width) + (10 * cant1);
                const cant2 = k;
                const xf = x + (width * cant2) + (10 * cant2);
                const yf = y + height + 50;
                console.log(xi,y,xf,yf,"Left");
                await this.mergeSwap(xi,y,xf,yf,this._arr[l],aux,0,s - 1,x,y + height + 50);
                aux[k++] = this._arr[l++];
            }
            else{
                const cant1 = (r - i);
                const xi = x + (cant1 * width) + (10 * cant1);
                const cant2 = k;
                const xf = x + (width * cant2) + (10 * cant2);
                const yf = y + height + 50;
                console.log(xi,y,xf,yf,"Right");
                await this.mergeSwap(xi,y,xf,yf,this._arr[r],aux,0,s - 1,x,y + height + 50);
                aux[k++] = this._arr[r++];
            }
        }
        while(l <= m){
            const cant1 = (l - i);
            const xi = x + (cant1 * width) + (10 * cant1);
            const cant2 = k;
            const xf = x + (width * cant2) + (10 * cant2);
            const yf = y + height + 50;
            console.log(xi,y,xf,yf,"Left");
            await this.mergeSwap(xi,y,xf,yf,this._arr[l],aux,0,s - 1,x,y + height + 50);
            aux[k++] = this._arr[l++];
        }
        while(r <= f){
            const cant1 = (r - i);
            const xi = x + (cant1 * width) + (10 * cant1);
            const cant2 = k;
            const xf = x + (width * cant2) + (10 * cant2);
            const yf = y + height + 50;
            console.log(xi,y,xf,yf,"Right");
            await this.mergeSwap(xi,y,xf,yf,this._arr[r],aux,0,s - 1,x,y + height + 50);
            aux[k++] = this._arr[r++];
        }
        await this.MergeUp(aux,0,s - 1,s,x,y,y + height + 50);
        for(let j = 0; j < s; ++j)
            this._arr[i + j] = aux[j];
        return new Promise(resolve => {
            resolve('resolved');
        });
    }
    async MergeDown(arr,init, end,s,x,y,iY){
        let initY = iY;
        while(true){
            if(initY == y){
                let xi = x;
                for(let i = init; i <= end; ++i){
                    this.drawNumberRectangle(arr[i],xi,y,true);
                    xi += width;
                    xi += 10;
                }   
                break;
            }
            let xi = x;
            let yi = initY;
            //ctx.clearRect(0,0,canvas.width,canvas.height);
            this.drawSingle();
            for(let i = init; i <= end; ++i){
                this.drawNumberRectangle(arr[i],xi,yi,true);
                xi += width;
                xi += 10;
            }   
            ++initY;
            await resolveAfter(x,yi,(width*s)+(10*s),height);
        }
        //this.draw();
        return new Promise(resolve => {
            resolve('resolved');
        });
    }
    async MergeUp(arr,init, end,s,x,y,iY,toDraw){
        let initY = iY;
        while(true){
            if(initY == y){
                let xi = x;
                for(let i = init; i <= end; ++i){
                    this.drawNumberRectangle(arr[i],xi,y,true);
                    xi += width;
                    xi += 10;
                }   
                break;
            }
            let xi = x;
            let yi = initY;
            ctx.clearRect(x-5,yi,(width*s)+(10*s),height + 50)
            for(let i = init; i <= end; ++i){
                this.drawNumberRectangle(arr[i],xi,yi,true);
                xi += width;
                xi += 10;
            }   
            --initY;
            await resolveAfter(x,yi,(width*s)+(10*s),height);
        }
        //this.draw();
        return new Promise(resolve => {
            resolve('resolved');
        });
    }
    async mergeSwap(xi,yi,xf,yf,value,arr,init,end,xr,yr){
        const m = (yf - yi) / (xf - xi);
        const b = yf - (m*xf);
        if(xf > xi ){
            for(let x = xi; x <= xf; ++x){
                const y = m*x + b;
                this.drawNumberRectangle(value,x,y,true);
                await resolveAfter(x-5,y-10,width+10,height+20);
                this.drawMergedArray(arr,init,end,xr,yr);
                this.drawSingle();
            }
        }else if (xi > xf){
            for(let x = xi; x >= xf; --x){
                const y = m*x + b;
                this.drawNumberRectangle(value,x,y,true);
                await resolveAfter(x-5,y-10,width+10,height+20);
                this.drawMergedArray(arr,init,end,xr,yr);
                this.drawSingle();
            }
        }else if (xi === xf) {
            let y = yi;
            while(y < yf){
                ++y;
                this.drawNumberRectangle(value,xi,y,true);
                await resolveAfter(xi-5,y-10,width+10,height+20);
                this.drawMergedArray(arr,init,end,xr,yr);
                this.drawSingle();
            }
        }
        return new Promise(resolve => {
            resolve('resolved');
        });
    }
    draw(){
        let i = 0
        this._stack.forEach( element => {
            const data = element[0];
            let x = data.x;
            let y = data.y;
            let last = false;
            if(i === this._stack.length - 1) last = true;
            for(let i = data.i; i <= data.f; ++i){
                this.drawNumberRectangle(this._arr[i],x,y,last);
                x += width;
                x += 10;
            }
            ++i;
        })
    }
    drawNumberRectangle(n,x,y,last){
        if(!last) ctx.fillStyle = '#F00';
        else ctx.fillStyle = '#21F50A';
        ctx.fillRect(x, y, width, height);
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.fillStyle = '#FFF';
        ctx.font = '1.8rem sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText((n === undefined)?"null":n.toString(),x + (width / 2), y + (height/2));
    }
    drawSingle(pos = this._stack.length - 1){
        const data = this._stack[pos][0];
        let x = data.x;
        let y = data.y;
        const cant = (data.f - data.i) + 1;
        ctx.clearRect(x,y,x + (width * cant) + (10 * cant), height + 10);
        for(let i = data.i; i <= data.f; ++i){
            this.drawNumberRectangle(this._arr[i],x,y,true);
            x += width;
            x += 10;
        }
    }
    drawMergedArray(arr,init,end,x,y){
        let xi = x;
        const cant = (end - init) + 1;
        ctx.clearRect(x,y,x + (width * cant) + (10 * cant), height + 10);
        for(let i = init; i <= end; ++i){
            this.drawNumberRectangle(arr[i],xi,y,true);
            xi += width;
            xi += 10;
        }   
    }
    drawSortedArray(){
        let x = this._x;
        for(let i = 0; i < this._arr.length; ++i){
            let toDraw = false;
            this.drawNumberRectangle(this._arr[i],x,this._y,toDraw);
            x += width;
            x += 10;
        }
    }
}

const sorting = new IterativeMergeSort(15);

async function drawing(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    sorting.draw();
    await sorting.mergesort();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    sorting.drawSortedArray();
}

//document.addEventListener('keydown',go);

function init(){
    
    drawing();
    
}
init();