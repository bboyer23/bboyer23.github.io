/* 

	Author: Benjamin Boyer
	Date: 2/13/24
	Purpose / Scope:

		Simulate the user experience of obtaining a seat on a plane



*/


import java.util.*;
import java.security.*;

public class PlaneSystem {

	Scanner scn = new Scanner(System.in); // instance object for class file
	Random r = new Random();
	private final boolean[] SEAT_AVAIL = new boolean[11]; // 10 seats using all indexes
	private int FIRST_CLASS = r.nextInt(1,6); // random seat for 1-5
	private int SECOND_CLASS = r.nextInt(6,11); // random seat 6-10
	private int first_alloc = 0, second_alloc = 0; // keep track of occupied seats

	private final int MAX_FIRST = 5; // max number of allowed first class seats
	private final int MAX_SECOND = 5; // max number of allowed economy seats

	public void resetState(){

		for(int i = 0; i < SEAT_AVAIL.length; i++){ // confirm values intialized to false

			SEAT_AVAIL[i] = false;
		}

	}

	// get the current 

	public boolean[] getCurrentState(){

		return SEAT_AVAIL;
	}



	public void setRandomValue1(){

		FIRST_CLASS = r.nextInt(1,6);
	}

	public int getRandomValue1(){

		return FIRST_CLASS;
	}

	public void setRandomValue2(){

		SECOND_CLASS = r.nextInt(6,11);
	}

	public int getRandomValue2(){

		return SECOND_CLASS;
	}
	


	public static void main(String[] args) { // driver / test method

		int user_choice, user_second_choice;

		PlaneSystem state = new PlaneSystem(); // create object to reference instance variables
		
		state.resetState(); // reset state of array in this case, create false values to validate

		boolean[] currentSeatAvailability = state.getCurrentState(); // set new array in main method equal to the current state of SEAT_AVAIL

		state.displayState(currentSeatAvailability); // confirm state false

		System.out.println("Welcome to Spirit Airlines!\nPlease respond accordingly..\n1. First-Class 2. Economy 3. Exit"); // prompt user

		user_choice = state.scn.nextInt(); // store user response
		state.scn.nextLine(); // read input

		while(user_choice != 3){ // sentinel controlled loop 3 to exit



				if(user_choice == 1){ // if user choice is 1


					if(state.first_alloc < state.MAX_FIRST){ // check if allocattion exceeds limit

						while(currentSeatAvailability[state.FIRST_CLASS]){ // while value is true

							 state.FIRST_CLASS = state.r.nextInt(1,6); // generate a number until it lands on a false value breaking the loop
						}

						currentSeatAvailability[state.FIRST_CLASS] = true; // then set the value to true (taking the seat)
						System.out.println("First-Class seat " + state.FIRST_CLASS + " has been succesfully filled!"); // display user their seat


						state.setRandomValue1(); // generate a new random value

						state.first_alloc++; // increment the allocation

						if(state.first_alloc >= 5){

							System.out.println("First-Class Seats are full."); // inidicate to user if all seats are full
						}
				



						} else {

							System.out.println("First-Class is already booked."); // Indicate to user that first class is full
							System.out.println("Would you like to try an Economy seat? 1. Yes 2. NO"); // Provide options to user
							user_second_choice = state.scn.nextInt(); // read that input

							if(user_second_choice == 1){ // when user choice is YES

								if(state.second_alloc < state.MAX_SECOND){ // if the current allocation is less than the max allowed allocation

									while(currentSeatAvailability[state.SECOND_CLASS]){ // while the array at a random value is true generate a new number until loop breaks

										state.SECOND_CLASS = state.r.nextInt(6,11); // this means that in case 1: array cannot find a false value indicating all true
																					// case 2: array has all false values and it breaks the loop once it assigns a value to state.second_class
									}

									currentSeatAvailability[state.SECOND_CLASS] = true; // once loops break set that value to true
									System.out.println("Economy seat " + state.SECOND_CLASS + " has been succesfully filled!"); // prompt the user
									state.setRandomValue2(); // set a new random value? 6-11
									state.second_alloc++; // increment the amount of seats being taken up

									/*

									if(state.second_alloc == 5){

										System.out.println("All seats are full...");
									}

									*/

								} else {

									System.out.println("All seats are full"); // if state.second alloc is no longer less than the max
									System.out.println("Next flight leaves in 3 hours!"); // let user know when next fight is leaving
								}


						} else {

							System.out.println("Next flight leaves in 3 hours!");
							break;
						}

					}




				} else if(user_choice == 2){



					if(state.second_alloc < state.MAX_SECOND){ // check if allocattion exceeds limit

						while(currentSeatAvailability[state.SECOND_CLASS]){ // while value is true

							 state.SECOND_CLASS = state.r.nextInt(1,6) + 5; // generate a number until it lands on a false value breaking the loop
						}

						currentSeatAvailability[state.SECOND_CLASS] = true; // then set the value to true (taking the seat)
						System.out.println("Economy-Class seat " + state.SECOND_CLASS + " has been succesfully filled!"); // display user their seat


						state.setRandomValue2(); // generate a new random value

						state.second_alloc++; // increment the allocation

						if(state.second_alloc >= 5){

							System.out.println("Economy-Class Seats are full."); // inidicate to user if all seats are full
						}
				



						} else {

							System.out.println("Economy-Class is already booked.");
							System.out.println("Would you like to try an First-Class seat? 1. Yes 2. NO");
							user_second_choice = state.scn.nextInt();

							if(user_second_choice == 1){

								if(state.first_alloc < state.MAX_FIRST){

									while(currentSeatAvailability[state.FIRST_CLASS]){

										state.FIRST_CLASS = state.r.nextInt(6,11);
									}

								currentSeatAvailability[state.FIRST_CLASS] = true;
								System.out.println("First-Class seat " + state.FIRST_CLASS + " has been succesfully filled!");
								state.setRandomValue2();
								state.first_alloc++;

									/*

									if(state.first_alloc >= 5){

										System.out.println("All seats are full...");
									}

									*/

								} else {

									System.out.println("All seats are full");
									System.out.println("Next flight leaves in 3 hours!");
								}


						} else {

							System.out.println("Next flight leaves in 3 hours!");
							break;
						}

					}

				} else {

					System.out.println("Critical Error");
					break;
				}

			user_choice = 0;

			state.displayState(currentSeatAvailability);

			System.out.println("Welcome to Spirit Airlines!\nPlease respond accordingly..\n1. First-Class 2. Economy 3. Exit"); // prompt user

			user_choice = state.scn.nextInt(); // store user response
			state.scn.nextLine();

		}

		System.out.println("Thank you for choosing Spirit Airlines! Have a WONDERFUL day!");


	}

	public void displayState(boolean[] bool){ // method for displaying content of array

		for(int i = 1; i < bool.length; i ++){

			if(bool[i] == true){

				System.out.printf(" -%d F - ", i);

			} else{

				System.out.printf(" -%d A - ", i);
			}


			}

		System.out.println();


	}
}