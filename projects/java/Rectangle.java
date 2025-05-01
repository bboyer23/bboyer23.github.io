/***
 * 
 * 	Fields:
 * 		Length
 * 		Width
 * 
 * 	Provide a no argument constructor and a constructor that accepts arguements for length & width
 * 
 * 
 * 
 * */


public class Rectangle {

	private double length;
	private double width;

	public Rectangle() {

		this(1,1);

	}

	public Rectangle(double width, double length){

		this.length = length;
		this.width = width;
	}

	public double PerimeterR(double width, double length){

		double z = 2*(this.width * this.length);
		return z;
	}

	public double AreaR(double width, double length){

		double z = width * length;
		return z;
	}
	
	public double getWidth(){

		return this.width;


	}

	public double getLength(){

		return this.length;


	}

	public void setWidth(double width){

		if(width > 20 || width < 0){

			System.out.println("Error 203;REASON: VALUE MISMATCH 20 > 0");
			System.exit(0);
		}

		this.width = width;


	}

	public void setLength(double length){

		if(length > 20 || length < 0){

			System.out.println("Error 205;REASON: VALUE MISMATCH 20 > 0");
			System.exit(0);
		}

		this.length = length;


	}

	public String toString(){

		return "Length: " + getLength() + "\nWidth: " + getWidth() + "\nArea: " + AreaR(this.width,this.length) + "\nPerimeter: " + PerimeterR(this.width,this.length);
	}

}