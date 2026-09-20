import sys
import math


def simple_interest(principal, rate, time_days):
    # Simple interest formula: SI = P * R * T / 100
    # T expressed in years using days/365
    time_years = time_days / 365
    return principal * rate * time_years / 100


def compound_interest(principal, rate, time_days, compounding_periods_per_year=365):
    # Compound interest formula: A = P * (1 + R/(n*100))^(n*T)
    # T expressed in years using days/365
    time_years = time_days / 365
    amount = principal * (1 + (rate / 100) / compounding_periods_per_year) ** (compounding_periods_per_year * time_years)
    return amount - principal


def main():
    if len(sys.argv) != 4:
        print("Usage: python Interestcalculator.py <No._of_days> <Principal> <Interest_Rate>")
        sys.exit(1)

    try:
        no_of_days = float(sys.argv[1])
        principal = float(sys.argv[2])
        interest_rate = float(sys.argv[3])
    except ValueError:
        print("All arguments must be numeric.")
        sys.exit(1)

    si = simple_interest(principal, interest_rate, no_of_days)
    ci = compound_interest(principal, interest_rate, no_of_days)

    print(f"Simple Interest: ${si:.2f}")
    print(f"Compound Interest: ${ci:.2f}")


if __name__ == "__main__":
    main()
