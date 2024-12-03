const DataLayer = require("companydata");

class BusinessEntity {
    
    constructor() {        
        this.dl = new DataLayer("jl8592");        
    }
}

module.exports = BusinessEntity;