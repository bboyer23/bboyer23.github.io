/***
 * 
 * 	Author: Benjamin A. Boyer
 * 	Date: 4/29/24
 * 	Purpose/Scope:
 * 
 * 		Enter a check amount from user input and display the numeric value as a String representation of the values 

 		E.G.
 			123.23
 			ONE HUNDRED TWENTY THREE 23/100
 * 
 * */

import java.util.*; // utility library
import java.util.regex.*; // regex library
public class checkAmountConverter {
	
	public static void main(String[] args){


		Scanner scn = new Scanner(System.in); // scanner for user input

		String regexDot = "\\."; // regex to split the string

		// array intialization section
		String[] firstNumSet = {"ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGHT","NINE"};// 1-9
		String[] secondNumSet = {"ELEVEN","TWELVE","THIRTEEN","FOURTEEN","FIFTEEN","SIXTEEN","SEVENTEEN","EIGHTEEN","NINETEEN"}; // 11-19
		String[] thirdNumSet = {"TEN","TWENTY","THIRTY","FOURTY","FIFTY","SIXTY","SEVENTY","EIGHTY","NINETY"}; // 10-90
		String hundred = "HUNDRED"; // 100


		System.out.println("Please enter a dollar amount $XX.XX:\n"); // prompt user for input

		String dollarAmount = scn.nextLine(); // store numerical value as a String

		String[] newDollarAmount = dollarAmount.split(regexDot); // split the string using regex

		// System.out.println(newDollarAmount[1] + "/100"); // print the second position in the array

		// now we develop the printing scheme

		String updatedAmount = newDollarAmount[0]; // make sure the split value is stored into another string object

		// System.out.println(updatedAmount); // display for programmings sake

		char[] storeVal = new char[updatedAmount.length()]; // develop a character array of arbirtary length word to allow space

		for(int i =0; i < updatedAmount.length(); i++){

			storeVal[i] = updatedAmount.charAt(i); // storing the values into a character array now

			if(updatedAmount.length() <= 1){

			// im going to try my best to explain this logic as it really broke my brain
				// so in class I remember that we used the core values to navigate an array and use those values
				// to navigate within an array
				// knowing that a String is an array of characters gave me the idea that if we can find a shared value system
				// used for character values that we can leverage this for printing the word defintions

				System.out.println(firstNumSet[(int) storeVal[i] - 49] + " AND " + newDollarAmount[1] + "/100"); 
				// System.out.println("Character: " + storeVal[i] + ", Code Point: " + (int) storeVal[i]);  // identify the value

			}  
		}

		int num = Integer.parseInt(updatedAmount);

		// Conditional checks for number range
        
        if (num >= 10 && num < 20) { // checks if number is between 10 and 20 (i guess the above loop does not work as intended)

            System.out.println(secondNumSet[num - 11] + " AND " + newDollarAmount[1] + "/100"); // display the amount by subtracting 11 from the value of the parsed int value

        } else if (num >= 20 && num < 100) { // checks if the value parsed is between 20 and 100

            int tens = num / 10; // this extracts the tens values from the integer value

            int ones = num % 10; // this extracts the ones value from the digit by doing modulus 10

            String result = thirdNumSet[tens - 1];

            if (ones != 0) { // if there is no remainder then 

                result += " " + firstNumSet[ones - 1]; // add to the result string a space followed by the corresponding ones place value

            }

            System.out.println(result + " AND " + newDollarAmount[1] + "/100"); // once past the initial conditional checks print the results

            // start hundreds

        } else if (num >= 100 && num < 1000) { // check if a number is between 100 and 1000


		    int hundreds = num / 100; // determine the 100s place
		    int remainder = num % 100; // determine the remainder for conditional checks
		    int tens = remainder / 10; // determine the tens place using the remainder value
		    int ones = remainder % 10; // determine the ones value using the remainder value
	    
		   String result = firstNumSet[hundreds - 1] + " HUNDRED"; // start with the hundreds place
	    
		    if (remainder != 0) { // if the remainder is not 0

		        result += " AND "; // concatenate _AND

		        if (remainder < 10) { // if the remainder is less than 10

		            // only ones place to add
		            result += firstNumSet[ones - 1];

		        } else if (remainder < 20) {

		            // handle teens separately

		            result += secondNumSet[remainder - 11];

		        } else { 

		            // handle tens and ones knowing that remainder is not less than 10
		            if (ones == 0) { // if ones IS 0

		                result += thirdNumSet[tens - 1]; // identify value in thirdNumSet array by subtracting 1 from tens variable using it as a pointer in array

		            } else {

		                result += thirdNumSet[tens - 1] + " " + firstNumSet[ones - 1]; // we know that there has to be a non-zero ones place value
		                
		            }
		        }

		        System.out.println(result + " AND " + newDollarAmount[1] + "/100"); // print the final result
		    }
		}



		//48-57


	}
}