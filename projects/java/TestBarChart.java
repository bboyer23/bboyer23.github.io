public class TestBarChart {
	
	public static void main(String[] args){

		BarChart chart1 = new BarChart(100);

		int starTotal = chart1.getStars();

		for(int i = 0; i < starTotal; i++){
			chart1.setStars(i);
			chart1.displayChart();
		}		
	}
}