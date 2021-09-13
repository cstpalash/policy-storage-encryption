# [POC] What is a policy?
Policy is an **executable** specification with **explicit definition** and **multiple implementations**. Few basic features of a policy are

- Single definition but multiple implementations
- Business should understand each policy definition
- Should have approval workflow for business and tech stakeholders
- Should be able to incorporate a new implementation easily
- Should be developed, built, tested and deployed independently
- Independent function/API which should be invoked and scaled on-demand
- Should be able to serve multiple environments (dev/uat/prod) and multiple versions
- Should have high observability throughout lifecycle

## A ready example : policy-storage-encryption
[**Policy definition** (features/policy.feature)](features/policy.feature) : This is a BDD (cucumber) feature - each scenario is an implementation
[**Policy test** (features/policy.js)](features/policy.js) : This is a BDD (cucumber) step-definition
[**Policy implementations** (app.js)](app.js) : This is a function (FAAS) to serve multiple implementations - developed, built, tested and deployed independently. Can be invoked on-demand and scale (to zero as well).

## How to run locally
```
git clone <this repo>
cd policy-storage-encryption
npm install
npm test
```