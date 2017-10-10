class OpenPositionsSystem {
    initialize(world) 
    {
        this.world = world
    }

    
    openLongPosition(entity, order)
    {
        // SEND XHR TO BUY THE COIN

        entity.set('longPosition', {
            id: order.id,
            currency: order.currency,
            price: order.longAt,
            amount: order.amount,
            exchange: order.longFrom,
            time: order.time
        })
        console.log(new Date().toISOString(),'opened long position on',order.longFrom,'for',order.amount,order.currency,'at',order.longAt)
    }

    
    openShortPosition(entity, order)
    {
        // SEND XHR TO SELL THE COIN
        
        entity.set('shortPosition', {
            id: order.id,
            currency: order.currency,
            price: order.shortAt,
            amount: order.amount,
            exchange: order.shortFrom,
            time: order.time
        })
        console.log(new Date().toISOString(),'opened short position on',order.shortFrom,'for',order.amount,order.currency,'at',order.shortAt)
    }


    every(order, newOrder, entity) 
    {
        entity.remove('newOrder')

        this.openLongPosition(entity, order)
        this.openShortPosition(entity, order)
    }
}

exports.OpenPositionsSystem = OpenPositionsSystem