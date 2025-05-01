/***
 * 
 * 	Author: Benjamin Boyer
 * 	Date: 2/29/24
 * 	Purpose/Scope:
 * 
 * 	- Private instance variable named income type double
 * 	- constructor
 * 		- intialize the instance variable income with the value passed via the parameter
 * 		- set method for updating the instance variable income with the value passed
 * 		- get method that returns the value of the instance variable income
 * 		- method named getStateTax that returns the state tax rate of 5%
 * 		- fed tax rate 20% 
 * 
 * 
 * 
 * */
public class TaxCalculator {


	// declare income variable
	private double income;

	// constructor method with one parameter
	public TaxCalculator(double income){

		this.income = income;

	}

	// getter for income

	public double getIncome(){

		return this.income;
	}

	// setter for income

	public void setIncome(double income){

		this.income = income;
	}

	// set the state tax with the 0.05 value as the multiplier
	public double getStateTax(){

		return this.income * 0.05;
	}

	// get the federal tax with 0.2 as the multiplier

	public double getFederalTax(){

		return this.income * 0.2;
	}

	// get the total tax, as well as display all prior information in .2f format
	public String getSummary(){

		return String.format("Income: %.2f \nState Tax: %.2f\nFederal Tax: %.2f\nTotal Tax: %.2f",this.income,getStateTax(),getFederalTax(),(getStateTax() + getFederalTax()));

		// return "Income: " + this.income + "\nState Tax: " + getStateTax() + "\nFederal Tax: " + getFederalTax() + "\nTotal Tax: " + (getStateTax() + getFederalTax());
	}

}