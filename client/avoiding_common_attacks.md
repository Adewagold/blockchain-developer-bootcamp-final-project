## Avoiding common attacks

### SWC-103 FLoating Pragma
Pragma locked

### SWC-131
No presence of unused variable


### SWC-107 Re-entrancy
The remitfunds guard agains a re-entrancy attack such that the remitFunds function after going through different validations, call the withdraw methods of any created institution. Therefore, the withdraw functions checks the userbalance and deduct from the balance before sending the transaction to deposit funds to the account.

```
function withdraw(uint amount, address fakeAddress) public returns(bool){
        require(availableBalance>= amount, "Insufficient balance.");
        availableBalance-=amount;
        (bool success, ) = payable(fakeAddress).call{value:amount}("");
        require(success, "Withdrawal failed");
        return success;
    }
```

### Checks-Effects-Interactions  (Avoiding state changes after external calls)
```
        availableBalance-=amount;
        (bool success, ) = payable(fakeAddress).call{value:amount}("");
```

### Proper use of .call and .delegateCall
The proper use of `.call` method in both `Institution` and `InstitutionManager` contracts are seen in the snippet below:
InstitutionManager
        ```
        totalRevenue-=amount;
        (bool success, ) = payable(destinationAccount).call{value:amount}("");
        ```
Institution
`(bool success, ) = payable(fakeAddress).call{value:amount}("");`