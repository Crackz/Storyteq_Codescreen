# Assumptions
- It's okay to have a slow app startup 
- Company won't issue cancelling order with insufficient quantity

# Summary
> On app initialization, I create a node readable stream to read the trades csv which gets passed to a readline stream so I can read line by line and then after parsing the line. the data is validated and named as a Trade in trades stream service. Trade is received by a handler in trades service that takes into consideration the time overlapping, whether the company is still well behaved or not, etc...

# Run the app

```bash
# To Start Development On Watch Mode
$ npm run start:dev

# To Run Tests Once
$ npm run test
```

----------------------------------------------------------------
# Task: JavaScript-CodeScreen-Excessive-Trade-Cancelling

## Explanation
`data/trades.csv` is a large CSV file that contains a list of trade messages, one per line in the following format:

`Time of trade message, CompanyName, Order Type - New order (D) or Cancel (F), Quantity`

The lines are time ordered although **two or more lines may have the same time**.
Company names will not contain any commas. Ignore any lines which are not properly formatted and **continue to process** the rest of the file.

### Here are some example lines: 

| Time | Company name | Order Type | Quantity |
| ----------- | ----------- | ----------- | ----------- |
| 2015-02-28 07:58:14 | Bank of Mars | D | 140 |
| 2015-02-28 08:00:13 | Bank of Mars | D | 500 |
| 2015-02-28 08:00:14 | Bank of Mars | D | 200 |
| 2015-02-28 08:01:13 | Bank of Mars | F | 200 |
| 2015-02-28 08:04:29 | Joe traders | D | 110 |
| 2015-02-28 08:05:22 | Joe traders | F | 11 |
| 2015-02-28 08:05:25 | Joe traders | D | 70 |

If, in any given **60 second** period and for a given company, the ratio of the cumulative quantity of cancels to cumulative quantity of orders is greater than **1/3** then the company is engaged in excessive cancelling.

### Consider the above lines:
- During the period 08:00:14 to 08:01:13 `Bank of Mars` made 400 new orders and cancels,
of which 200 were cancels. This is 50% and is excessive cancelling.
- First line `2015-02-28 07:58:14,Bank of Mars,D,140` is just one event in any 60 seconds interval, because nothing more happend at +-60 seconds.
That means that at this interval `Bank of Mars` is not engaged in excessive cancelling.
- `Joe traders` did not engage in excessive cancelling.

## Your Task

In the [excessive-cancellations-checker.js](excessive-cancellations-checker.js) you will find a `ExcessiveCancellationsChecker` class that must have 2 methods to be implemented:
- **companiesInvolvedInExcessiveCancellations**: should return array of companies, that are engaged in excessive cancelling
- **totalNumberOfWellBehavedCompanies**: should return a number of companies that are not engaged in excessive cancelling
  
The `ExcessiveCancellationsChecker` class accepts filepath to csv (example file is [data/trades.csv](data/trades.csv)), which you need to parse and calculate the result. You are free to add your own methods to the class, but above mentioned a **required** to be there.

## Tests
Run `npm install` to install all dependencies and then run `npm run test` to run the unit tests. These should all pass if your solution has been implemented correctly.

The unit tests in the [tests/excessive-cancellations-checker.spec.js](tests/excessive-cancellations-checker.spec.js) class should pass if the functions
in [excessive-cancellations-checker.js](excessive-cancellations-checker.js) are implemented correctly. You are welcome to add more tests.

## Requirements

The [data/trades.csv](data/trades.csv) file and the [tests/excessive-cancellations-checker.spec.js](tests/excessive-cancellations-checker.spec.js) file should not be modified. If you would like
to add your own unit tests you can add these in a separate file in the `tests` folder.

The [package.json](package.json) file should only be modified in order to add any third-party dependencies required for your solution. The `jest` and `babel` versions should not be changed.

The [.github/workflows/node.js.yml](.github/workflows/node.js.yml) file should also not be modified.

Your solution must use/be compatible with Node.js version `15.5.1`.

##

Good luck!
## License

At CodeScreen, we strongly value the integrity and privacy of our assessments. As a result, this repository is under exclusive copyright, which means you **do not** have permission to share your solution to this test publicly (i.e., inside a public GitHub/GitLab repo, on Reddit, etc.). <br>

## Submitting your solution

Please push your changes to the `main branch` of this repository. You can push one or more commits. <br>

Once you are finished with the task, please click the `Submit Solution` link on <a href="https://app.codescreen.com/candidate/f795d7f4-a55d-493c-b416-12513b846a40" target="_blank">this screen</a>.