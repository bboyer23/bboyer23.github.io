/****
 * 
 * 	Name: Benjamin Boyer
 * 	Date: March 28th, 2024
 * 	
 * 	Purpose: Midterm exam tester class
 * 
 * 
 * 
 * 
 * */

import java.util.*;
public class LandTest {
	

	public static void main(String[] args){

		Scanner scn = new Scanner(System.in);

		LandTract[] objects = new LandTract[3];



		System.out.println("Enter first length, then width for Tract 1: ");
	    LandTract tract1 = new LandTract(scn.nextDouble(),scn.nextDouble());
	    objects[0] = tract1;

		System.out.println("Enter first length, then width for Tract 2: ");
		LandTract tract2 = new LandTract(scn.nextDouble(),scn.nextDouble());
		objects[1] = tract2;

		System.out.println("Enter first length, then width for Tract 3: ");
		LandTract tract3 = new LandTract(scn.nextDouble(),scn.nextDouble());
		objects[2] = tract3;

		for(int i = 0; i < objects.length; i++){

			System.out.println("Info for LandTract " + (i + 1));

			System.out.println(objects[i] + "\n");
		}

		
	}
}