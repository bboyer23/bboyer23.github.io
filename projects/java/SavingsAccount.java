public class SavingsAccount {

	
	private static double annualInterestRate = 0;
	private double savingsBalance;

	public SavingsAccount(double savingsBalance) throws IllegalArgumentException{

		if(savingsBalance > 0){

		this.savingsBalance = savingsBalance;

		} else if(savingsBalance < 0) {

			throw new IllegalArgumentException("Negative Values Not Allowed.");

		}
	}

	public void calculateMonthlyInterest(){

		double total = (this.savingsBalance * annualInterestRate)/ 12;

		this.savingsBalance += total;

	}

	public static void modifyInterestRate(double newAnnualInterestRate) throws IllegalArgumentException {

		if(newAnnualInterestRate < 0 || newAnnualInterestRate > 1){

			throw new IllegalArgumentException("Must be {0,1}");

		} else {

			annualInterestRate = newAnnualInterestRate;

			}

	}	

	public String toString(){

		return String.format("Annual Interest: %.2f \nSavings Balance:%.2f",annualInterestRate,savingsBalance);

	}

}