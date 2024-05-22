export default interface Money{
    amount: number
}

export function canBuyThatManyFor( money:Money) :number{
    if ( amount == null ) throw new DomainPrimitiveException( "price == null" );
    return ( this.amount / price.amount );
}