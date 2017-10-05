class OpenOrdersSystem {
	initialize(world) {
        this.world = world
    }
    
    every(order) {
        console.log('order',order)
    }
}

exports.OpenOrdersSystem = OpenOrdersSystem