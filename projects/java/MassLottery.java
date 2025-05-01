/****
 * 
 * 	Name: Benjamin Boyer
 * 	Date: March 28th, 2024
 * 	
 * 	Purpose: Midterm exam 
 * 
 * 
 * 
 * 
 * */
import java.util.*;
public class MassLottery {
	
	// declare 5 private variables n1,n2,n3,...n5

	private int n1;
	private int n2;
	private int n3;
	private int n4;
	private int n5;

	Random rand = new Random();

	// public instance method named spin (with no params and no return type so void)
	// set 5 instance variables to a random value in the range 0-70

	public void Spin(){

		this.n1 = rand.nextInt(0,70);
		this.n2 = rand.nextInt(0,70);
		this.n3 = rand.nextInt(0,70);
		this.n4 = rand.nextInt(0,70);
		this.n5 = rand.nextInt(0,70);
	}

	// public instance method named draw (no parameters and no return type so void again)
	// print the 5 values of the instance variables

	public void Draw(){

		System.out.printf("The winning numbers are: %d %d %d %d %d\n",this.n1,this.n2,this.n3,this.n4,this.n5);
	}

}