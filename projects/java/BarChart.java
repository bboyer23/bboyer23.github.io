public class BarChart {

	private int stars;

	public BarChart(int stars){

		this.stars = stars;
	}

	public void setStars(int stars){

		this.stars = stars;

	}

	public int getStars(){

		return this.stars;
	}
	
	public void displayChart(){

		for(int i = 0; i < this.stars; i++){

			for(int j = 0; j < this.stars; j++){

				if(i == j){

					System.out.print();
				}

				System.out.print("*");
				
			}

			System.out.println();

		}

	}
}