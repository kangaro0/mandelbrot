import { Peer } from "./interfaces";


export class List<T extends Peer > {

    private arr: Array<T>;

    constructor( l: number ){
        this.arr = new Array<T>( l );
    }

    public get( i: number ){
        return this.arr[ i ];
    }

    public getById( id: string ){
        let l = this.arr.length;
        for( let i = 0 ; i < l ; i++ )
            if( this.arr[ i ].id.localeCompare( id ) )
                return this.arr[ i ];
        return null;
    }

    public set( i: number, v: T ){
        this.arr[ i ] = v;
    }

    public push( v: T ){
        this.arr.push( v );
    }
}