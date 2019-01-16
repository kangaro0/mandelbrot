import { Peer } from './interfaces'

export class List<T extends Peer> {

    private arr: Array<T>;

    constructor( l: number ){
        this.arr = new Array<T>(l);
    }

    public get( i: number ){
        return this.arr[ i ];
    }

    public getById( id: string ){
        let l = this.arr.length;
        for( let i = 0 ; i < l ; i++ )
            if( this.arr[ i ].id.localeCompare( id ) === 0 )
                return this.arr[ i ];
        return null;
    }

    public push( p: T ){
        this.arr.push( p );
    }

    public set( i: number, p: T ){
        this.arr[ i ] = p;
    }

    public removeById( id: string ){
        console.log( 'removing' );
        let l = this.arr.length;
        for( let i = 0 ; i < l ; i++ )
            if( this.arr[ i ].id.localeCompare( id ) === 0 )
                this.arr.splice( i, 1 );
    }

    public length(){
        return this.arr.length;
    }
}