# Calculate Compound Interest

Use this instruction when the user asks to calculate compound interest for an investment or loan and needs the final accumulated amount and total interest earned.

## When to use this tool

Use the `compound_interest.py` tool when:
- the user provides a principal amount,
- an annual interest rate,
- a number of compounding periods per year,
- and a total time period in years.

This is appropriate for financial calculations such as savings growth, investment projections, or compounded loan balances.

## Tool to use

Use the script at `tools/compound_interest.py`.

## Command-line usage

Run the script with these arguments in order:

```bash
python tools/compound_interest.py <principal> <annual_rate> <compounds_per_year> <years>
```

### Example

```bash
python tools/compound_interest.py 15847 7.34 12 8.5833333333
```

## What the tool returns

The script prints:
- the final amount after compounding,
- the total interest earned.

It should output values in currency format with two decimal places.

Example output:

```text
Final Amount: $29697.95
Interest Earned: $13850.95
```

## How to present results

When reporting the result to the user, include:
- the principal amount,
- the annual rate,
- the compounding frequency,
- the total time period,
- the final amount,
- and the interest earned.

Use a concise explanation such as:

"Using a principal of $15,847 at 7.34% annual interest compounded monthly for 8 years and 7 months, the final amount is $29,697.95 and the total interest earned is $13,850.95."

Keep the response brief, clear, and financially accurate.
