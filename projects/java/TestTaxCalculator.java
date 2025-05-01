/***
 * 
 * 
 * 	Author: Benjamin Boyer
 * 	Date: 2/29/24
 * 	Purpose/ Scope:
 * 
 * 		Driver class / test class/ client class to test Tax Calculator
 * 
 * 
 * */

 public class TestTaxCalculator {

 	public static void main(String[] args){

 		// create two taxIncome objects

 		TaxCalculator taxIncome1 = new TaxCalculator(50000.00);
 		TaxCalculator taxIncome2 = new TaxCalculator(100000.00);

 		// System.out.println(taxIncome1.getSummary());

 		// create a tax calculator array

 		TaxCalculator[] incomes = new TaxCalculator[2];

 		// store those values into each indicie of the array
 		incomes[0] = taxIncome1;
 		incomes[1] = taxIncome2;

 		// iterate through the array to get the summary of each object

 		for(int i = 0; i < incomes.length; i++){

 			System.out.println(incomes[i].getSummary());
 			System.out.println();
 		}


 	}
 }