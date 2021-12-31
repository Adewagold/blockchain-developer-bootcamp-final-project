## Design Pattern Decision

### Inter-Contract Execution
In the `InstitutionManager` contract, it calls the withdraw method of `Institution` contract to withdraw funds to a given address.

### Inheritance and Interfaces
Both `Institution` and `InstitutionManager` inherits the ownable contract

### Access Control Design Patterns
Both `Institution` and `InstitutionManager` inherits and uses the OpenZeppelin Ownable contract for access control.
