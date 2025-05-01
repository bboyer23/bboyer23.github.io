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


public class LandTract {
	
	// two fields
	// (1) tracts length (double) (2) width (a double)

	private double tract_length;
	private double tract_width;

	// a constructor that accepts arguments for the two fields

	// might as well make a default constructor as well

	public LandTract(){

		this.tract_length = 0;
		this.tract_width = 0;
	}

	public LandTract(double tract_length,double tract_width){

		this.tract_length = tract_length;
		this.tract_width = tract_width;


	}

	// a method that returns the tracts area (length * width)

	public double tractArea(double tract_length,double tract_width){


		double area = this.tract_length * this.tract_width;

		return area;


	}

	//this was my best attempt, maybe I can review with you in office hours
	// totally forgot how to override an equals method

	public boolean equals(LandTract tract1){

		if(tract1 != null){

			return true;
		} else {

			return false;
		}
	}



	@Override
	public String toString(){

		return String.format("Length: %.2f\nWidth: %.2f\nArea: %.2f",this.tract_length,this.tract_width,tractArea(this.tract_width,this.tract_length));
	}



}