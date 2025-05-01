import java.security.*;
public class RollTheDice{


	SecureRandom r = new SecureRandom();
	// field variables
	private int numberOfDice; // instance of numberOfDice
	private int sides; // instance of sides on each dice
	private int[] lastRoll; // instance of value storing the result of the last roll

	// create a constructor
	public RollTheDice(int numberOfDice,int sides){

		this.numberOfDice = numberOfDice;
		this.sides = sides;
		this.lastRoll = new int[numberOfDice]; 
	}

	public void roll(){

		for(int i = 0; i < numberOfDice; i++){

			lastRoll[i] = r.nextInt(sides) + 1;


		}

	}

	public int[] getLastRoll(){

		return lastRoll;
	}

	public String toString(){

		return String.format(

			"Number of Dice: " + numberOfDice +
		    "\nNumber of Sides: " + sides 


			);
	}






}