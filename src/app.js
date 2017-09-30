/**
 * Created by Marco Radossi on 11/10/2017.
 */

'use strict';

import {World} from 'picoes'
import {Promise} from 'bluebird'
import request from 'request'

import {ExchangeComponent} from '../src/components/exchange'
import {UpdatingComponent} from '../src/components/updating'
import {PairValueComponent} from '../src/components/pair_value'

import {ExchangeGetDataSystem} from '../src/systems/exchange_get_data'
import {ShowCoinsValuesSystem} from '../src/systems/show_coins_values'

import {markets} from '../src/config/settings'



let world = new World()

world.component('exchange', ExchangeComponent )
world.component('pairValue', PairValueComponent )
// world.component('updateCoinCommand', DoUpdateCoinValueCommand )

world.system(['exchange'], ExchangeGetDataSystem)
world.system(['pairValue'], ShowCoinsValuesSystem)

createExchangesEntities(markets)
createCoinsEntities(markets)


world.initialize(world, request)

setInterval(function() { 
    console.log('.')
    world.run() 
}, 1000)


function createExchangesEntities(markets)
{
    // console.log('markets',markets)
    for (let idx in markets) {
        
        world.entity()
            .set('exchange', { 
                name: markets[idx].marketName, 
                lastPriceUrl: markets[idx].URL,
                lastPriceFunction: markets[idx].lastPrice, 
                bidPriceFunction: null, 
                askPriceFunction: null,  
            });

    }
}


function createCoinsEntities(markets)
{
    // console.log('markets',markets)
    for (let idx in markets) {
        let coin = world.entity() 
            .set('pairValue', {
                mainCoin: 'ETH',
                baseCoin: 'BTC',
                value: null
            })
            .set(markets[idx].marketName)
    }
}
